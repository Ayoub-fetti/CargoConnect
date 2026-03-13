import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { Application, ApplicationSchema } from './schemas/application.schema';
import { MissionsModule } from '../missions/missions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
    ]),
    MissionsModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
