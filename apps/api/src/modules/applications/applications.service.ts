import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application, ApplicationStatus } from './schemas/application.schema';
import { Mission } from '../missions/schemas/mission.schema';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<Application>,
    @InjectModel(Mission.name) private missionModel: Model<Mission>,
  ) {}

  async apply(driverId: string, dto: CreateApplicationDto) {
    const mission = await this.missionModel.findById(dto.missionId);
    if (!mission) throw new NotFoundException('Mission not found');
    if (mission.status !== 'OPEN') {
      throw new BadRequestException('Mission is not open for applications');
    }

    const existing = await this.applicationModel.findOne({
      missionId: dto.missionId,
      driverId,
    });
    if (existing)
      throw new BadRequestException('Already applied to this mission');

    const application = new this.applicationModel({
      ...dto,
      driverId,
    });
    return application.save();
  }

  async findByDriver(driverId: string) {
    return this.applicationModel
      .find({ driverId })
      .populate('missionId')
      .sort({ createdAt: -1 });
  }

  async findByMission(missionId: string) {
    return this.applicationModel
      .find({ missionId })
      .populate('driverId', 'fullName phone email licenseTypes')
      .sort({ createdAt: -1 });
  }
}
