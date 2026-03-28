import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mission, MissionStatus } from './schemas/mission.schema';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';

@Injectable()
export class MissionsService {
  constructor(
    @InjectModel(Mission.name) private missionModel: Model<Mission>,
  ) {}

  async create(companyId: string, dto: CreateMissionDto) {
    const mission = new this.missionModel({ ...dto, companyId });
    return mission.save();
  }

  async findAll(filters?: { status?: MissionStatus }) {
    const query = filters?.status ? { status: filters.status } : {};
    return this.missionModel
      .find(query)
      .populate('companyId', 'companyName email location description legalInfo logo')
      .sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const mission = await this.missionModel
      .findById(id)
      .populate('companyId', 'companyName email location description legalInfo logo')
      .populate('assignedDriverId', 'fullName phone');

    if (!mission) throw new NotFoundException('Mission not found');
    return mission;
  }

  async update(id: string, companyId: string, dto: UpdateMissionDto) {
    const mission = await this.missionModel.findById(id);
    if (!mission) throw new NotFoundException('Mission not found');
    if (mission.companyId.toString() !== companyId.toString()) {
      throw new ForbiddenException('You can only update your own missions');
    }

    return this.missionModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async delete(id: string, companyId: string) {
    const mission = await this.missionModel.findById(id);
    if (!mission) throw new NotFoundException('Mission not found');
    if (mission.companyId.toString() !== companyId.toString()) {
      throw new ForbiddenException('You can only delete your own missions');
    }

    await mission.deleteOne();
    return { message: 'Mission deleted successfully' };
  }

  async findByCompany(companyId: string) {
    return this.missionModel
      .find({ companyId })
      .populate('assignedDriverId', 'fullName phone')
      .sort({ createdAt: -1 });
  }
}
