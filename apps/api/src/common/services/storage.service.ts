import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

// Handle file uploads to Azure Blob Storage
@Injectable()
export class StorageService implements OnModuleInit {
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;
  private readonly containerName = 'uploads';

  constructor(private configService: ConfigService) {
    const connectionString = this.configService.get<string>(
      'AZURE_STORAGE_CONNECTION_STRING',
    );

    if (!connectionString) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING is not configured');
    }

    this.blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
  }

  /**
   * Initialize the storage service and create container if it doesn't exist
   */
  async onModuleInit() {
    try {
      // Try to get container properties to check if it exists
      await this.containerClient.getProperties();
      console.log(`✓ Azure Storage container '${this.containerName}' is ready`);
    } catch (error) {
      if (error.code === 'ContainerNotFound') {
        try {
          // Create the container if it doesn't exist and allow direct blob reads.
          await this.blobServiceClient.createContainer(this.containerName, {
            access: 'blob',
          });
          console.log(
            ` Azure Storage container '${this.containerName}' created`,
          );
        } catch (createError) {
          console.error(
            ` Failed to create Azure Storage container: ${createError.message}`,
          );
          throw createError;
        }
      } else {
        console.error(`✗ Failed to connect to Azure Storage: ${error.message}`);
        throw error;
      }
    }

    try {
      // Keep container readable from direct URLs returned by uploadFile.
      await this.containerClient.setAccessPolicy('blob');
    } catch (error) {
      const code = error?.code;
      if (code === 'PublicAccessNotPermitted') {
        console.warn(
          'Azure account blocks public access. Direct blob URLs will 404 unless you use SAS or API proxy.',
        );
      } else {
        console.warn(
          `Could not set container public access: ${error?.message || error}`,
        );
      }
    }
  }

  /**
   * Upload a file buffer to Azure Blob Storage
   * @param folder - Subfolder path (e.g., 'avatars', 'documents')
   * @param filename - Name of the file
   * @param buffer - File buffer content
   * @param mimeType - MIME type of the file
   * @returns The full Azure Blob Storage URL
   */
  async uploadFile(
    folder: string,
    filename: string,
    buffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    try {
      const blobName = `${folder}/${filename}`;
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: {
          blobContentType: mimeType,
        },
      });

      // Return the full Azure Blob Storage URL
      return blockBlobClient.url;
    } catch (error) {
      console.error('Azure Storage upload error:', error);
      throw new Error(
        `Failed to upload file to Azure Blob Storage: ${error.message}`,
      );
    }
  }

  /**
   * Extract blob name from either a full Azure URL or a path
   * @param urlOrPath - Full Azure URL or path like 'uploads/avatars/file.jpg'
   * @returns The blob name
   */
  private extractBlobName(urlOrPath: string): string {
    // If it's a full Azure URL, extract the blob name from it
    if (urlOrPath.startsWith('https://')) {
      // URL format: https://accountname.blob.core.windows.net/container/blob/name
      const match = urlOrPath.match(/\/uploads\/(.+)$/);
      if (match) {
        return match[1];
      }
      // Try extracting everything after /uploads/
      const parts = urlOrPath.split('/uploads/');
      if (parts.length > 1) {
        return parts[1];
      }
    }
    // If it's already a path, remove the 'uploads/' prefix
    return urlOrPath.replace(/^uploads\//, '');
  }

  /**
   * Delete a file from Azure Blob Storage
   * @param urlOrPath - Full Azure URL or path (e.g., 'uploads/avatars/avatar-123.jpg')
   */
  async deleteFile(urlOrPath: string): Promise<void> {
    const blobName = this.extractBlobName(urlOrPath);

    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

    try {
      await blockBlobClient.delete();
    } catch (error) {
      // Silently fail if blob doesn't exist
      console.warn(`Failed to delete blob: ${blobName}`, error);
    }
  }

  /**
   * Get a download URL for a blob (returns the full Azure URL)
   * @param urlOrPath - Full Azure URL or path
   * @returns The full URL to the blob
   */
  getFileUrl(urlOrPath: string): string {
    // If it's already a full URL, return it
    if (urlOrPath.startsWith('https://')) {
      return urlOrPath;
    }
    // Otherwise, construct the URL from the blob name
    const blobName = this.extractBlobName(urlOrPath);
    return this.containerClient.getBlockBlobClient(blobName).url;
  }

  /**
   * Check if a blob exists
   * @param urlOrPath - Full Azure URL or path
   */
  async fileExists(urlOrPath: string): Promise<boolean> {
    const blobName = this.extractBlobName(urlOrPath);
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

    try {
      await blockBlobClient.getProperties();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Download a file from Azure Blob Storage
   * @param urlOrPath - Full Azure URL or path
   * @returns Object with stream and content type
   */
  async downloadFile(urlOrPath: string) {
    const blobName = this.extractBlobName(urlOrPath);
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

    try {
      const properties = await blockBlobClient.getProperties();
      const downloadResponse = await blockBlobClient.download(0);

      return {
        stream: downloadResponse.readableStreamBody,
        contentType: properties.contentType || 'application/octet-stream',
        contentLength: properties.contentLength,
      };
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new Error(`Failed to download file from Azure: ${error.message}`);
    }
  }
}
