import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Subscription,
  SubscriptionStatus,
} from '../../database/schemas/subscription.schema';
import { Role } from '../../database/schemas/user.schema';

// Checks subscription status
@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    @InjectModel(Subscription.name) private subModel: Model<Subscription>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user || user.role !== Role.COMPANY) return true;

    const companyId = user.sub.toString();
    let sub = await this.subModel.findOne({ companyId });

    // auto-create trial if no subscription exists
    if (!sub) {
      const trialEnd = new Date();
      trialEnd.setMonth(trialEnd.getMonth() + 1);
      sub = await this.subModel.create({
        companyId,
        trialEnd,
        status: SubscriptionStatus.TRIAL,
      });
    }

    const now = new Date();

    if (sub.status === SubscriptionStatus.TRIAL && now > sub.trialEnd) {
      sub.status = SubscriptionStatus.EXPIRED;
      await sub.save();
    }

    const isActive =
      sub.status === SubscriptionStatus.ACTIVE ||
      (sub.status === SubscriptionStatus.TRIAL && now <= sub.trialEnd);

    if (!isActive) {
      throw new ForbiddenException(
        'Your free trial has expired. Please subscribe to continue.',
      );
    }

    return true;
  }
}
