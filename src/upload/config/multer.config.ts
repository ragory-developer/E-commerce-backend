import { diskStorage } from 'multer';
import { UPLOAD_CONFIG } from './upload.config';
import * as fs from 'fs';
import { createId } from '@paralleldrive/cuid2';
import { extname, join } from 'path';
import { Request } from 'express';

// ! Ensure Upload directory is exists
export function ensureUploadDirectories() {
  const categories = Object.values(UPLOAD_CONFIG.CATEGORIES);

  categories.forEach((category) => {
    const dirPath = join(UPLOAD_CONFIG.UPLOAD_DIR, category);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true, mode: 0o755 });
    }
  });
}

// ! multer storage configuration
export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const allowedCategories = Object.values(UPLOAD_CONFIG.CATEGORIES);
      const category = allowedCategories.includes(req.body.category)
        ? req.body.category
        : UPLOAD_CONFIG.CATEGORIES.TEMP;

      const uploadPath = join(UPLOAD_CONFIG.UPLOAD_DIR, category);

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true, mode: 0o755 });
      }

      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const uniqueId = createId();
      const ext = extname(file.originalname).toLowerCase();
      const category = req.body.category || 'file';

      cb(null, `${category}_${uniqueId}${ext}`);
    },
  }),

  fileFilter: (req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    const allExtensions = [
      ...UPLOAD_CONFIG.ALLOWED_EXTENSIONS.IMAGE,
      ...UPLOAD_CONFIG.ALLOWED_EXTENSIONS.VIDEO,
      ...UPLOAD_CONFIG.ALLOWED_EXTENSIONS.DOCUMENT,
      ...UPLOAD_CONFIG.ALLOWED_EXTENSIONS.EXCEL,
    ];

    if (allExtensions.includes(ext)) cb(null, true);
    else cb(new Error(`File type ${ext} is not allowed`), false);
  },

  limits: {
    fileSize: Math.max(
      UPLOAD_CONFIG.MAX_FILE_SIZE.IMAGE,
      UPLOAD_CONFIG.MAX_FILE_SIZE.VIDEO,
      UPLOAD_CONFIG.MAX_FILE_SIZE.DOCUMENT,
    ),
    files: 10,
  },
};
