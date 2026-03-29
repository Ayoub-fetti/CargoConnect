import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, Role } from '../../database/schemas/user.schema';
import { DocumentsService } from '../documents/documents.service';
import { StorageService } from '../../common/services/storage.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private documentsService: DocumentsService,
    private storageService: StorageService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: any, role: Role) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== role) throw new BadRequestException('Invalid role');

    Object.assign(user, dto);
    await user.save();
    return user;
  }

  async updateAvatar(userId: string, path: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new BadRequestException('User not found');
    if (user.role.toString() !== 'DRIVER')
      throw new BadRequestException('Only drivers can upload avatars');

    if ((user as any).avatar) {
      await this.storageService.deleteFile((user as any).avatar);
    }

    (user as any).avatar = path;
    await user.save();
    return { avatar: path };
  }

  async updateLogo(userId: string, path: string) {
    const user = await this.userModel.findById(userId);
    if (!user || user.role !== Role.COMPANY)
      throw new BadRequestException('Invalid user');

    if ((user as any).logo) {
      await this.storageService.deleteFile((user as any).logo);
    }

    (user as any).logo = path;
    await user.save();
    return { logo: path };
  }

  async uploadDocument(
    userId: string,
    file: Express.Multer.File,
    type: string,
    storedPath: string,
  ) {
    return this.documentsService.uploadDocument(userId, file, type, storedPath);
  }

  async getDocuments(userId: string) {
    return this.documentsService.getUserDocuments(userId);
  }

  async deleteDocument(userId: string, documentId: string) {
    return this.documentsService.deleteDocument(userId, documentId);
  }
}
