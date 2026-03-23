import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, Role } from '../../database/schemas/user.schema';
import { Mission, MissionStatus } from '../missions/schemas/mission.schema';
import { Application } from '../applications/schemas/application.schema';
import { Subscription } from '../../database/schemas/subscription.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Mission.name) private missionModel: Model<Mission>,
    @InjectModel(Application.name) private applicationModel: Model<Application>,
    @InjectModel(Subscription.name) private subModel: Model<Subscription>,
  ) {}

  async listUsers(role?: Role, page = 1, limit = 20) {
    const filter = role ? { role } : {};
    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(filter),
    ]);
    return { users, total, page, limit };
  }

  async toggleUserStatus(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    user.isActive = !user.isActive;
    await user.save();
    return { id: userId, isActive: user.isActive };
  }

  async getStats() {
    const [
      totalDrivers,
      totalCompanies,
      activeDrivers,
      activeCompanies,
      totalMissions,
      missionsByStatus,
      totalApplications,
      totalSubscriptions,
      activeSubscriptions,
    ] = await Promise.all([
      this.userModel.countDocuments({ role: Role.DRIVER }),
      this.userModel.countDocuments({ role: Role.COMPANY }),
      this.userModel.countDocuments({ role: Role.DRIVER, isActive: true }),
      this.userModel.countDocuments({ role: Role.COMPANY, isActive: true }),
      this.missionModel.countDocuments(),
      this.missionModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.applicationModel.countDocuments(),
      this.subModel.countDocuments(),
      this.subModel.countDocuments({ status: { $in: ['trial', 'active'] } }),
    ]);

    return {
      users: { totalDrivers, totalCompanies, activeDrivers, activeCompanies },
      missions: {
        total: totalMissions,
        byStatus: Object.fromEntries(
          missionsByStatus.map((s) => [s._id, s.count]),
        ),
      },
      applications: { total: totalApplications },
      subscriptions: { total: totalSubscriptions, active: activeSubscriptions },
    };
  }

  async listSubscriptions(page = 1, limit = 20) {
    const [subs, total] = await Promise.all([
      this.subModel
        .find()
        .populate('companyId', 'email companyName')
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.subModel.countDocuments(),
    ]);
    return { subscriptions: subs, total, page, limit };
  }
}
