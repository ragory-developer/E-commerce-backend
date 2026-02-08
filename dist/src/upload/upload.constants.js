"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALID_FOLDERS = exports.THUMBNAIL_SIZE = exports.MAX_IMAGE_WIDTH = exports.IMAGE_QUALITY = exports.MAX_FILES_COUNT = exports.MAX_FILE_SIZE = exports.MIME_TO_EXT = exports.ALLOWED_IMAGE_TYPES = void 0;
exports.ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
];
exports.MIME_TO_EXT = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
};
exports.MAX_FILE_SIZE = 5 * 1024 * 1024;
exports.MAX_FILES_COUNT = 10;
exports.IMAGE_QUALITY = 80;
exports.MAX_IMAGE_WIDTH = 1920;
exports.THUMBNAIL_SIZE = 300;
exports.VALID_FOLDERS = [
    'product',
    'profile',
    'category',
    'brand',
    'tag',
    'general',
];
//# sourceMappingURL=upload.constants.js.map