/**
 * UPLOAD INTERFACES
 */

export interface UploadResult {
  url: string;
  path: string;
  filename: string;
  size: number;
  mimetype: string;
  category: string;
  thumbnails?: ThumbnailResult[];
  metadata?: FileMetadata;
}

export interface ThumbnailResult {
  size: string; // 'small' | 'medium' | 'large'
  url: string;
  path: string;
  width: number;
  height: number;
}

export interface FileMetadata {
  width?: number;
  height?: number;
  format?: string;
  duration?: number; // for videos
  pages?: number; // for PDFs
}

export interface DeleteResult {
  success: boolean;
  message: string;
  deletedFiles: string[];
}
