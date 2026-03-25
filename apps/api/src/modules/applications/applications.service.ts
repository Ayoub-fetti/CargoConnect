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
  async approve(applicationId: string, companyId: string) {
    const application = await this.applicationModel
      .findById(applicationId)
      .populate('missionId');
    if (!application) throw new NotFoundException('Application not found');

    const mission = application.missionId as any;
    if (mission.companyId.toString() !== companyId.toString()) {
      throw new BadRequestException(
        'Not authorized to approve this application',
      );
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new BadRequestException('Application is not pending');
    }

    application.status = ApplicationStatus.ACCEPTED;
    await application.save();

    await this.missionModel.findByIdAndUpdate(mission._id, {
      assignedDriverId: application.driverId,
      status: 'IN_PROGRESS',
    });

    await this.applicationModel.updateMany(
      { missionId: mission._id, _id: { $ne: applicationId } },
      { status: ApplicationStatus.REJECTED },
    );

    return application;
  }

  async reject(applicationId: string, companyId: string) {
    const application = await this.applicationModel
      .findById(applicationId)
      .populate('missionId');
    if (!application) throw new NotFoundException('Application not found');

    const mission = application.missionId as any;
    if (mission.companyId.toString() !== companyId.toString()) {
      throw new BadRequestException(
        'Not authorized to reject this application',
      );
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new BadRequestException('Application is not pending');
    }

    application.status = ApplicationStatus.REJECTED;
    return application.save();
  }
}
