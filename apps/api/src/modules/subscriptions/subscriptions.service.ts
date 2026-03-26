import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import {
  Subscription,
  SubscriptionStatus,
  SubscriptionPlan,
} from '../../database/schemas/subscription.schema';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Injectable()
export class SubscriptionsService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Subscription.name) private subModel: Model<Subscription>,
    private config: ConfigService,
  ) {
    this.stripe = new Stripe(this.config.get<string>('STRIPE_SECRET_KEY')!);
  }

  async getOrCreateSubscription(companyId: string): Promise<Subscription> {
    let sub = await this.subModel.findOne({ companyId });
    if (!sub) {
      const trialEnd = new Date();
      trialEnd.setMonth(trialEnd.getMonth() + 1);
      sub = await this.subModel.create({
        companyId,
        trialEnd,
        status: SubscriptionStatus.TRIAL,
      });
    }
    return sub;
  }

  async getStatus(companyId: string) {
    const sub = await this.getOrCreateSubscription(companyId);
    const now = new Date();

    if (sub.status === SubscriptionStatus.TRIAL && now > sub.trialEnd) {
      sub.status = SubscriptionStatus.EXPIRED;
      await sub.save();
    }

    // check stripe for cancel_at_period_end
    let cancelAtPeriodEnd = false;
    if (sub.stripeSubscriptionId) {
      try {
        const stripeSub = await this.stripe.subscriptions.retrieve(
          sub.stripeSubscriptionId,
        );
        cancelAtPeriodEnd = stripeSub.cancel_at_period_end;
      } catch {}
    }

    return {
      status: sub.status,
      plan: sub.plan ?? null,
      trialEnd: sub.trialEnd,
      currentPeriodEnd: sub.currentPeriodEnd ?? null,
      cancelAtPeriodEnd,
      isActive:
        [SubscriptionStatus.TRIAL, SubscriptionStatus.ACTIVE].includes(
          sub.status,
        ) &&
        (sub.status === SubscriptionStatus.TRIAL ? now <= sub.trialEnd : true),
    };
  }

  async createCheckoutSession(
    companyId: string,
    dto: CreateCheckoutDto,
    email: string,
  ) {
    const companyIdStr = companyId.toString(); // fix: ensure plain string
    const sub = await this.getOrCreateSubscription(companyIdStr);

    const priceMap: Record<SubscriptionPlan, string> = {
      [SubscriptionPlan.MONTHLY]: this.config.get('STRIPE_PRICE_1_MONTH')!,
      [SubscriptionPlan.QUARTERLY]: this.config.get('STRIPE_PRICE_3_MONTHS')!,
      [SubscriptionPlan.YEARLY]: this.config.get('STRIPE_PRICE_1_YEAR')!,
    };

    let customerId = sub.stripeCustomerId;
    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email,
        metadata: { companyId: companyIdStr }, // fix: plain string
      });
      customerId = customer.id;
      sub.stripeCustomerId = customerId;
      await sub.save();
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceMap[dto.plan], quantity: 1 }],
      success_url: `${this.config.get('FRONTEND_URL')}/billing/success`,
      cancel_url: `${this.config.get('FRONTEND_URL')}/billing/cancel`,
      metadata: { companyId: companyIdStr, plan: dto.plan }, // fix: plain string
    });

    return { url: session.url };
  }

  private getPeriodEnd(stripeSub: Stripe.Subscription): Date | undefined {
    const ts =
      (stripeSub as any).current_period_end ??
      stripeSub.items?.data?.[0]?.current_period_end;
    if (!ts || isNaN(ts)) return undefined;
    return new Date(ts * 1000);
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.config.get<string>('STRIPE_WEBHOOK_SECRET')!,
      );
    } catch {
      throw new BadRequestException('Invalid webhook signature');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { companyId, plan } = session.metadata!;
      const stripeSubId = session.subscription as string;

      const stripeSub = await this.stripe.subscriptions.retrieve(stripeSubId);
      const periodEnd = this.getPeriodEnd(stripeSub);

      await this.subModel.findOneAndUpdate(
        { companyId },
        {
          stripeSubscriptionId: stripeSubId,
          plan: plan as SubscriptionPlan,
          status: SubscriptionStatus.ACTIVE,
          ...(periodEnd && { currentPeriodEnd: periodEnd }),
        },
      );
    }

    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object;
      const subId = (invoice as any).subscription as string;
      await this.subModel.findOneAndUpdate(
        { stripeSubscriptionId: subId },
        { status: SubscriptionStatus.PAST_DUE },
      );
    }

    if (event.type === 'customer.subscription.deleted') {
      const stripeSub = event.data.object;
      await this.subModel.findOneAndUpdate(
        { stripeSubscriptionId: stripeSub.id },
        { status: SubscriptionStatus.CANCELED },
      );
    }

    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object;
      if (invoice.billing_reason === 'subscription_cycle') {
        const subId = (invoice as any).subscription as string;
        const stripeSub = await this.stripe.subscriptions.retrieve(subId);
        const periodEnd = this.getPeriodEnd(stripeSub);

        await this.subModel.findOneAndUpdate(
          { stripeSubscriptionId: stripeSub.id },
          {
            status: SubscriptionStatus.ACTIVE,
            ...(periodEnd && { currentPeriodEnd: periodEnd }),
          },
        );
      }
    }

    return { received: true };
  }

  async cancelSubscription(companyId: string) {
    const sub = await this.subModel.findOne({ companyId });
    if (!sub?.stripeSubscriptionId) {
      throw new BadRequestException('No active subscription found');
    }

    await this.stripe.subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // update DB immediately
    sub.status = SubscriptionStatus.CANCELED;
    await sub.save();

    return {
      message: 'Subscription will be cancelled at end of billing period.',
    };
  }

  async listAllBills(page = 1, limit = 20) {
    const subs = await this.subModel
      .find({ stripeCustomerId: { $exists: true } })
      .populate('companyId', 'email companyName')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const bills = await Promise.all(
      subs.map(async (sub) => {
        const invoices = await this.stripe.invoices.list({
          customer: sub.stripeCustomerId!,
          limit: 10,
        });
        return {
          company: sub.companyId,
          plan: sub.plan,
          status: sub.status,
          invoices: invoices.data.map((inv) => ({
            id: inv.id,
            amount: inv.amount_paid / 100,
            currency: inv.currency,
            status: inv.status,
            date: new Date(inv.created * 1000),
            pdf: inv.invoice_pdf,
          })),
        };
      }),
    );

    return bills;
  }
}
