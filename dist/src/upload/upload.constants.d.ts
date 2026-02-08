export declare const ALLOWED_IMAGE_TYPES: readonly ["image/jpeg", "image/png", "image/gif", "image/webp"];
export declare const MIME_TO_EXT: Record<string, string>;
export declare const MAX_FILE_SIZE: number;
export declare const MAX_FILES_COUNT = 10;
export declare const IMAGE_QUALITY = 80;
export declare const MAX_IMAGE_WIDTH = 1920;
export declare const THUMBNAIL_SIZE = 300;
export declare const VALID_FOLDERS: readonly ["product", "profile", "category", "brand", "tag", "general"];
export type ImageFolder = (typeof VALID_FOLDERS)[number];
