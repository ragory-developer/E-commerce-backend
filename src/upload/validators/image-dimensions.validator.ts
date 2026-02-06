/**
 * IMAGE DIMENSIONS VALIDATOR
 * Validates image dimensions using Sharp library
 */

import { BadRequestException } from '@nestjs/common';
import sharp from 'sharp';
import { UPLOAD_CONFIG } from '../config/upload.config';
import * as fs from 'fs';

export class ImageDimensionsValidator {
  /**
   * Validate image dimensions
   */
  static async validate(file: Express.Multer.File): Promise<void> {
    try {
      const metadata = await sharp(file.path).metadata();

      const { width = 0, height = 0 } = metadata;
      const { MIN_WIDTH, MIN_HEIGHT, MAX_WIDTH, MAX_HEIGHT } =
        UPLOAD_CONFIG.IMAGE_DIMENSIONS;

      // Check minimum dimensions
      if (width < MIN_WIDTH || height < MIN_HEIGHT) {
        fs.unlinkSync(file.path);
        throw new BadRequestException(
          `Image dimensions too small. Minimum: ${MIN_WIDTH}x${MIN_HEIGHT}px. Received: ${width}x${height}px`,
        );
      }

      // Check maximum dimensions
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        fs.unlinkSync(file.path);
        throw new BadRequestException(
          `Image dimensions too large. Maximum: ${MAX_WIDTH}x${MAX_HEIGHT}px. Received: ${width}x${height}px`,
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      // If Sharp can't read the file, it's likely corrupted or not an image
      fs.unlinkSync(file.path);
      throw new BadRequestException('Invalid or corrupted image file');
    }
  }

  /**
   * Get image metadata
   */
  static async getMetadata(filePath: string): Promise<sharp.Metadata> {
    try {
      return await sharp(filePath).metadata();
    } catch (error) {
      throw new BadRequestException(`Unable to read image metadata: ${error}`);
    }
  }
}
