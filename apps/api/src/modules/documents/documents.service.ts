import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Document } from '../../database/schemas/document.schema';
import { StorageService } from '../../common/services/storage.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private documentModel: Model<Document>,
    private storageService: StorageService,
  ) {}

  async uploadDocument(
    userId: string,
    file: Express.Multer.File,
    type: string,
    storedPath: string,
  ) {
    return this.documentModel.create({
      userId,
      filename: file.filename,
      originalName: file.originalname,
      path: storedPath,
      mimetype: file.mimetype,
      size: file.size,
      type,
    });
  }

  async getUserDocuments(userId: string) {
    const objectId = Types.ObjectId.isValid(userId)
      ? new Types.ObjectId(userId)
      : null;

    return this.documentModel
      .find({
        $or: [
          { userId },
          ...(objectId ? [{ userId: objectId }] : []),
          {
            $expr: {
              $eq: [{ $toString: '$userId' }, userId],
            },
          },
        ],
      })
      .sort({ createdAt: -1 });
  }

  async deleteDocument(userId: string, documentId: string) {
    const doc = await this.documentModel.findOne({ _id: documentId, userId });
    if (doc) {
      await this.storageService.deleteFile(doc.path);
      await doc.deleteOne();
    }
    return { message: 'Document deleted' };
  }
}
