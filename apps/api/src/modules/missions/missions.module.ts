import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';
import { Mission, MissionSchema } from './schemas/mission.schema';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mission.name, schema: MissionSchema }]),
    SubscriptionsModule,
  ],
  controllers: [MissionsController],
  providers: [MissionsService],
  exports: [MissionsService, MongooseModule],
})
export class MissionsModule {}
