import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { StorageService } from './common/services/storage.service';

@Controller('files')
export class FilesController {
  constructor(private storageService: StorageService) {}

  /**
   * Proxy endpoint to serve files from Azure Blob Storage
   * Usage: GET /api/files/avatars/filename.jpg
   */
  @Get(':folder/:filename')
  async serveFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const blobPath = `${folder}/${filename}`;
      const file = await this.storageService.downloadFile(blobPath);

      // Set response headers
      res.set('Content-Type', file.contentType);
      if (file.contentLength) {
        res.set('Content-Length', file.contentLength.toString());
      }
      res.set('Cache-Control', 'public, max-age=86400'); // Cache for 1 day

      // Stream the blob to the response
      if (file.stream) {
        file.stream.pipe(res);
      }
    } catch (error) {
      console.error('Error serving file:', error);
      throw new NotFoundException('File not found');
    }
  }
}

