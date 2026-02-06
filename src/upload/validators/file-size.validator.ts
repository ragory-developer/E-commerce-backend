/**
 * FILE SIZE VALIDATOR
 * Validates file sizes based on category
 */

import { BadRequestException } from '@nestjs/common';
import { UPLOAD_CONFIG } from '../config/upload.config';

export class FileSizeValidator {
  /**
   * Validate file size based on category
   */
  static validate(
    file: Express.Multer.File,
    category: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'EXCEL' | 'PROFILE',
  ): void {
    const maxSize = UPLOAD_CONFIG.MAX_FILE_SIZE[category];

    if (file.size > maxSize) {
      throw new BadRequestException(
        `File size exceeds limit. Maximum: ${this.formatBytes(maxSize)}. Received: ${this.formatBytes(file.size)}`,
      );
    }
  }

  /**
   * Format bytes to human-readable format
   */
  static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  /**
   * Get max size for category
   */
  static getMaxSize(
    category: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'EXCEL' | 'PROFILE',
  ): number {
    return UPLOAD_CONFIG.MAX_FILE_SIZE[category];
  }
}
