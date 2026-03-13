import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Document } from '../../database/schemas/document.schema';
import * as fs from 'fs/promises';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private documentModel: Model<Document>,
  ) {}

  async uploadDocument(userId: string, file: Express.Multer.File, type: string) {
    return this.documentModel.create({
      userId,
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      type,
    });
  }

  async getUserDocuments(userId: string) {
    return this.documentModel.find({ userId });
  }

  async deleteDocument(userId: string, documentId: string) {
    const doc = await this.documentModel.findOne({ _id: documentId, userId });
    if (doc) {
      await fs.unlink(doc.path).catch(() => {});
      await doc.deleteOne();
    }
    return { message: 'Document deleted' };
  }
}
