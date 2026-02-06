/**
 * UPLOAD SERVICE
 * Handles all file uploads (images, videos, documents, excel)
 */

import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { join, basename } from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { UPLOAD_CONFIG } from './config/upload.config';
import { FileTypeValidator } from './validators/file-type.validator';
import { FileSizeValidator } from './validators/file-size.validator';
import { ImageDimensionsValidator } from './validators/image-dimensions.validator';
import {
  UploadResult,
  ThumbnailResult,
  DeleteResult,
} from './interfaces/upload-result.interface';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  /**
   * UPLOAD IMAGE
   */
  async uploadImage(
    file: Express.Multer.File,
    category: string,
    subfolder?: string,
  ): Promise<UploadResult> {
    try {
      // 1. Validate file type
      await FileTypeValidator.validate(file, 'IMAGE');

      // 2. Validate file size
      FileSizeValidator.validate(file, 'IMAGE');

      // 3. Validate image dimensions
      await ImageDimensionsValidator.validate(file);

      // 4. Process image (compress, convert to WebP)
      const processedFile = await this.processImage(file);

      // 5. Generate thumbnails
      const thumbnails = await this.generateThumbnails(processedFile.path);

      // 6. Generate public URL
      const url = this.generatePublicUrl(processedFile.path);

      // 7. Get metadata
      const metadata = await ImageDimensionsValidator.getMetadata(
        processedFile.path,
      );

      this.logger.log(`Image uploaded successfully: ${url}`);

      return {
        url,
        path: processedFile.path,
        filename: processedFile.filename,
        size: processedFile.size,
        mimetype: processedFile.mimetype,
        category,
        thumbnails,
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
        },
      };
    } catch (error) {
      // Clean up file on error
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  /**
   * UPLOAD VIDEO
   */
  async uploadVideo(
    file: Express.Multer.File,
    category: string,
  ): Promise<UploadResult> {
    try {
      // 1. Validate file type
      await FileTypeValidator.validate(file, 'VIDEO');

      // 2. Validate file size
      FileSizeValidator.validate(file, 'VIDEO');

      // 3. Generate public URL
      const url = this.generatePublicUrl(file.path);

      // 4. Generate video thumbnail (optional)
      let thumbnails: ThumbnailResult[] = [];
      if (UPLOAD_CONFIG.VIDEO_PROCESSING.GENERATE_THUMBNAIL) {
        thumbnails = await this.generateVideoThumbnail(file.path);
      }

      this.logger.log(`Video uploaded successfully: ${url}`);

      return {
        url,
        path: file.path,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        category,
        thumbnails,
      };
    } catch (error) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  /**
   * UPLOAD DOCUMENT
   */
  async uploadDocument(
    file: Express.Multer.File,
    category: string,
  ): Promise<UploadResult> {
    try {
      // 1. Validate file type
      await FileTypeValidator.validate(file, 'DOCUMENT');

      // 2. Validate file size
      FileSizeValidator.validate(file, 'DOCUMENT');

      // 3. Generate public URL
      const url = this.generatePublicUrl(file.path);

      this.logger.log(`Document uploaded successfully: ${url}`);

      return {
        url,
        path: file.path,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        category,
      };
    } catch (error) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  /**
   * UPLOAD EXCEL/CSV
   */
  async uploadExcel(
    file: Express.Multer.File,
    category: string,
  ): Promise<UploadResult> {
    try {
      // 1. Validate file type
      await FileTypeValidator.validate(file, 'EXCEL');

      // 2. Validate file size
      FileSizeValidator.validate(file, 'EXCEL');

      // 3. Generate public URL
      const url = this.generatePublicUrl(file.path);

      this.logger.log(`Excel file uploaded successfully: ${url}`);

      return {
        url,
        path: file.path,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        category,
      };
    } catch (error) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  /**
   * DELETE FILE
   */
  async deleteFile(url: string): Promise<DeleteResult> {
    try {
      const path = this.urlToPath(url);
      const deletedFiles: string[] = [];

      // Delete main file
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
        deletedFiles.push(path);
      }

      // Delete thumbnails if they exist
      const thumbnailSizes = UPLOAD_CONFIG.IMAGE_PROCESSING.THUMBNAIL_SIZES;
      thumbnailSizes.forEach((size) => {
        const thumbnailPath = this.getThumbnailPath(path, size.name);
        if (fs.existsSync(thumbnailPath)) {
          fs.unlinkSync(thumbnailPath);
          deletedFiles.push(thumbnailPath);
        }
      });

      this.logger.log(`File deleted: ${url}`);

      return {
        success: true,
        message: 'File deleted successfully',
        deletedFiles,
      };
    } catch (error) {
      throw new BadRequestException('Failed to delete file');
    }
  }

  // ========================================
  // PRIVATE HELPER METHODS
  // ========================================

  /**
   * Process image (compress & convert)
   */
  private async processImage(
    file: Express.Multer.File,
  ): Promise<Express.Multer.File> {
    const format = UPLOAD_CONFIG.IMAGE_PROCESSING.FORMAT;
    const quality = UPLOAD_CONFIG.IMAGE_PROCESSING.QUALITY;

    const outputPath = file.path.replace(/\.[^.]+$/, `.${format}`);

    await sharp(file.path)
      .toFormat(format as any, { quality })
      .toFile(outputPath);

    // Delete original if format changed
    if (outputPath !== file.path) {
      fs.unlinkSync(file.path);
    }

    return {
      ...file,
      path: outputPath,
      filename: basename(outputPath),
      mimetype: `image/${format}`,
    };
  }

  /**
   * Generate thumbnails
   */
  private async generateThumbnails(
    imagePath: string,
  ): Promise<ThumbnailResult[]> {
    if (!UPLOAD_CONFIG.IMAGE_PROCESSING.GENERATE_THUMBNAILS) {
      return [];
    }

    const thumbnails: ThumbnailResult[] = [];
    const sizes = UPLOAD_CONFIG.IMAGE_PROCESSING.THUMBNAIL_SIZES;

    for (const size of sizes) {
      const thumbnailPath = this.getThumbnailPath(imagePath, size.name);

      await sharp(imagePath)
        .resize(size.width, size.height, {
          fit: 'cover',
          position: 'center',
        })
        .toFile(thumbnailPath);

      thumbnails.push({
        size: size.name,
        url: this.generatePublicUrl(thumbnailPath),
        path: thumbnailPath,
        width: size.width,
        height: size.height,
      });
    }

    return thumbnails;
  }

  /**
   * Generate video thumbnail
   */
  private async generateVideoThumbnail(
    videoPath: string,
  ): Promise<ThumbnailResult[]> {
    // Video thumbnail generation requires ffmpeg
    // This is a placeholder - implement with fluent-ffmpeg if needed
    return [];
  }

  /**
   * Get thumbnail path
   */
  private getThumbnailPath(imagePath: string, size: string): string {
    const ext = imagePath.substring(imagePath.lastIndexOf('.'));
    const base = imagePath.substring(0, imagePath.lastIndexOf('.'));
    return `${base}_${size}${ext}`;
  }

  /**
   * Generate public URL from file path
   */
  private generatePublicUrl(filePath: string): string {
    const relativePath = filePath.replace(UPLOAD_CONFIG.UPLOAD_DIR, '');
    return `${UPLOAD_CONFIG.BASE_URL}/uploads${relativePath}`;
  }

  /**
   * Convert URL to file system path
   */
  private urlToPath(url: string): string {
    const relativePath = url.replace(`${UPLOAD_CONFIG.BASE_URL}/uploads`, '');
    return join(UPLOAD_CONFIG.UPLOAD_DIR, relativePath);
  }

  /**
   * Get file info
   */
  async getFileInfo(url: string) {
    const path = this.urlToPath(url);

    if (!fs.existsSync(path)) {
      throw new BadRequestException('File not found');
    }

    const stats = fs.statSync(path);

    return {
      url,
      path,
      size: stats.size,
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
    };
  }
}
