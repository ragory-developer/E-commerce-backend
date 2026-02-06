/**
 * FILE TYPE VALIDATOR
 * Validates file types using multiple methods for security
 */

import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import { UPLOAD_CONFIG } from '../config/upload.config';
import * as fileType from 'file-type';
import * as fs from 'fs';

export class FileTypeValidator {
  /**
   * Validate file type (MIME + Extension + Magic Bytes)
   */
  static async validate(
    file: Express.Multer.File,
    category: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'EXCEL',
  ): Promise<void> {
    // 1. Validate MIME type
    this.validateMimeType(file, category);

    // 2. Validate file extension
    this.validateExtension(file, category);

    // 3. Validate magic bytes (file signature)
    await this.validateMagicBytes(file, category);

    // 4. Check for double extensions (security)
    this.checkDoubleExtension(file);
  }

  /**
   * Validate MIME type
   */
  private static validateMimeType(
    file: Express.Multer.File,
    category: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'EXCEL',
  ): void {
    const allowedMimes = UPLOAD_CONFIG.ALLOWED_MIME_TYPES[category];

    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${allowedMimes.join(', ')}`,
      );
    }
  }

  /**
   * Validate file extension
   */
  private static validateExtension(
    file: Express.Multer.File,
    category: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'EXCEL',
  ): void {
    const ext = extname(file.originalname).toLowerCase();
    const allowedExtensions = UPLOAD_CONFIG.ALLOWED_EXTENSIONS[category];

    if (!allowedExtensions.includes(ext)) {
      throw new BadRequestException(
        `Invalid file extension. Allowed: ${allowedExtensions.join(', ')}`,
      );
    }
  }

  /**
   * Validate magic bytes (file signature)
   * This prevents fake file extensions
   */
  private static async validateMagicBytes(
    file: Express.Multer.File,
    category: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'EXCEL',
  ): Promise<void> {
    try {
      const buffer = fs.readFileSync(file.path);
      const type = await fileType.fileTypeFromBuffer(buffer);

      if (!type) {
        throw new BadRequestException('Unable to determine file type');
      }

      // Check if detected type matches category
      const allowedMimes = UPLOAD_CONFIG.ALLOWED_MIME_TYPES[category];

      if (!allowedMimes.includes(type.mime)) {
        // Clean up the uploaded file
        fs.unlinkSync(file.path);
        throw new BadRequestException(
          `File content does not match extension. Detected: ${type.mime}`,
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error validating file type');
    }
  }

  /**
   * Check for double extensions (e.g., image.php.jpg)
   * Security measure against execution attacks
   */
  private static checkDoubleExtension(file: Express.Multer.File): void {
    const filename = file.originalname.toLowerCase();
    const dangerousExtensions = [
      '.php',
      '.exe',
      '.sh',
      '.bat',
      '.cmd',
      '.com',
      '.pif',
      '.scr',
      '.vbs',
      '.js',
    ];

    for (const ext of dangerousExtensions) {
      if (filename.includes(ext)) {
        fs.unlinkSync(file.path);
        throw new BadRequestException(
          'Suspicious file name detected. Upload rejected.',
        );
      }
    }
  }

  /**
   * Get file category from MIME type
   */
  static getCategory(
    mimetype: string,
  ): 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'EXCEL' | null {
    if (UPLOAD_CONFIG.ALLOWED_MIME_TYPES.IMAGE.includes(mimetype)) {
      return 'IMAGE';
    }
    if (UPLOAD_CONFIG.ALLOWED_MIME_TYPES.VIDEO.includes(mimetype)) {
      return 'VIDEO';
    }
    if (UPLOAD_CONFIG.ALLOWED_MIME_TYPES.DOCUMENT.includes(mimetype)) {
      return 'DOCUMENT';
    }
    if (UPLOAD_CONFIG.ALLOWED_MIME_TYPES.EXCEL.includes(mimetype)) {
      return 'EXCEL';
    }
    return null;
  }
}
