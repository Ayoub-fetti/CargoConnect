import { IsEnum } from 'class-validator';
import { SubscriptionPlan } from '../../../database/schemas/subscription.schema';

export class CreateCheckoutDto {
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;
}
