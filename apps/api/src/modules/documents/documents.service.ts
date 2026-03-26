import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Document } from '../../database/schemas/document.schema';
import * as fs from 'fs/promises';
import { isAbsolute, join } from 'path';

const API_ROOT = join(__dirname, '..', '..', '..');

function resolveStoredPath(path: string) {
  return isAbsolute(path) ? path : join(API_ROOT, path);
}

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private documentModel: Model<Document>,
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
      await fs.unlink(resolveStoredPath(doc.path)).catch(() => {});
      await doc.deleteOne();
    }
    return { message: 'Document deleted' };
  }
}
