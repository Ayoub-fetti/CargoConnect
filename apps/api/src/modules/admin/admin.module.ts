import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../database/schemas/user.schema';
import { Mission, MissionSchema } from '../missions/schemas/mission.schema';
import {
  Application,
  ApplicationSchema,
} from '../applications/schemas/application.schema';
import {
  Subscription,
  SubscriptionSchema,
} from '../../database/schemas/subscription.schema';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Mission.name, schema: MissionSchema },
      { name: Application.name, schema: ApplicationSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
