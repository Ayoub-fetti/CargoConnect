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

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    @InjectModel(Subscription.name) private subModel: Model<Subscription>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    // only applies to COMPANY role
    if (!user || user.role !== Role.COMPANY) return true;

    const companyId = user.sub.toString();
    const sub = await this.subModel.findOne({ companyId });
    const now = new Date();

    // auto-expire trial
    if (sub?.status === SubscriptionStatus.TRIAL && now > sub.trialEnd) {
      sub.status = SubscriptionStatus.EXPIRED;
      await sub.save();
    }

    const isActive =
      sub?.status === SubscriptionStatus.ACTIVE ||
      (sub?.status === SubscriptionStatus.TRIAL && now <= sub.trialEnd);

    if (!isActive) {
      throw new ForbiddenException(
        'Your free trial has expired. Please subscribe to continue.',
      );
    }

    return true;
  }
}
