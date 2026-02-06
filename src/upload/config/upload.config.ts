export const UPLOAD_CONFIG = {
  //! base url for uploading directory
  UPLOAD_DIR: process.env.UPLOAD_DIR || '/home/username/public.html/uploads',

  // ! Base url for accessing uploaded files
  BASE_URL: process.env.BASE_URL || 'https://yourdomain.com',

  // ! maximum file size in bytes
  MAX_FILE_SIZE: {
    IMAGE: 5 * 1024 * 1024,
    VIDEO: 50 * 1024 * 1024,
    DOCUMENT: 10 * 1024 * 1024,
    EXCEL: 10 * 1024 * 1024,
    PROFILE: 10 * 1024 * 1024,
  },

  // ! Allowed mine types
  ALLOWED_MIME_TYPES: {
    IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],

    VIDEO: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],

    DOCUMENT: [
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    ],

    EXCEL: [
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'text/csv', // .csv
    ],
  },

  // Allowed file extensions
  ALLOWED_EXTENSIONS: {
    IMAGE: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    VIDEO: ['.mp4', '.webm', '.mov', '.avi'],
    DOCUMENT: ['.pdf', '.doc', '.docx'],
    EXCEL: ['.xls', '.xlsx', '.csv'],
  },

  // Image dimension limits
  IMAGE_DIMENSIONS: {
    MIN_WIDTH: 100,
    MIN_HEIGHT: 100,
    MAX_WIDTH: 5000,
    MAX_HEIGHT: 5000,
  },

  // Upload categories (folders)
  CATEGORIES: {
    BRANDS: 'brands',
    CATEGORIES: 'categories',
    PRODUCTS: 'products',
    PRODUCTS_MAIN: 'products/main',
    PRODUCTS_GALLERY: 'products/gallery',
    PROFILES_ADMIN: 'profiles/admins',
    PROFILES_CUSTOMER: 'profiles/customers',
    TAGS: 'tags',
    DOCUMENTS: 'documents',
    VIDEOS: 'videos',
    EXCEL: 'excel',
    TEMP: 'temp',
  },

  // Image processing settings
  IMAGE_PROCESSING: {
    QUALITY: 85, // JPEG/WebP quality (0-100)
    FORMAT: 'webp', // Convert to WebP for better compression
    GENERATE_THUMBNAILS: true,
    THUMBNAIL_SIZES: [
      { name: 'small', width: 150, height: 150 },
      { name: 'medium', width: 400, height: 400 },
      { name: 'large', width: 800, height: 800 },
    ],
  },

  // Video processing settings
  VIDEO_PROCESSING: {
    GENERATE_THUMBNAIL: true,
    THUMBNAIL_TIME: 1, // Capture frame at 1 second
  },
};
