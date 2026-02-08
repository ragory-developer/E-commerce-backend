"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var UploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const sharp_1 = __importDefault(require("sharp"));
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const path_1 = require("path");
const upload_constants_1 = require("./upload.constants");
let UploadService = UploadService_1 = class UploadService {
    prisma;
    config;
    logger = new common_1.Logger(UploadService_1.name);
    baseUrl;
    uploadDir;
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.baseUrl =
            this.config.get('BASE_URL') || 'http://localhost:3001';
        this.uploadDir = this.config.get('UPLOAD_DIR') || 'uploads';
    }
    async uploadImage(file, options) {
        this.validateImage(file);
        const processed = await this.processAndSaveImage(file, options.folder);
        const image = await this.prisma.image.create({
            data: {
                originalName: file.originalname,
                filename: processed.filename,
                path: processed.path,
                url: processed.url,
                mimetype: 'image/webp',
                size: processed.size,
                width: processed.width,
                height: processed.height,
                thumbnailUrl: processed.thumbnailUrl,
                folder: options.folder,
                alt: options.alt,
                createdBy: options.createdBy,
            },
        });
        this.logger.log(`Image uploaded: ${file.originalname} -> ${image.url}`);
        return this.formatResponse(image);
    }
    async uploadImages(files, options) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        const results = [];
        for (let i = 0; i < files.length; i++) {
            const result = await this.uploadImage(files[i], options);
            await this.prisma.image.update({
                where: { id: result.id },
                data: { sortOrder: i },
            });
            results.push(result);
        }
        this.logger.log(`${results.length} images uploaded to ${options.folder}`);
        return results;
    }
    async findAll(folder) {
        const where = { isDeleted: false };
        if (folder)
            where.folder = folder;
        const images = await this.prisma.image.findMany({
            where,
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        });
        return {
            message: 'Images retrieved successfully',
            data: images.map((img) => this.formatResponse(img)),
        };
    }
    async findById(id) {
        const image = await this.prisma.image.findFirst({
            where: { id, isDeleted: false },
        });
        if (!image) {
            throw new common_1.NotFoundException('Image not found');
        }
        return {
            message: 'Image retrieved successfully',
            data: this.formatResponse(image),
        };
    }
    async softDelete(id) {
        const image = await this.prisma.image.findFirst({
            where: { id, isDeleted: false },
        });
        if (!image) {
            throw new common_1.NotFoundException('Image not found');
        }
        await this.prisma.image.update({
            where: { id },
            data: {
                isDeleted: true,
                isActive: false,
                deletedAt: new Date(),
            },
        });
        this.logger.log(`Image soft deleted: ${image.originalName}`);
        return { message: 'Image deleted successfully' };
    }
    async softDeleteMany(ids) {
        const result = await this.prisma.image.updateMany({
            where: { id: { in: ids }, isDeleted: false },
            data: {
                isDeleted: true,
                isActive: false,
                deletedAt: new Date(),
            },
        });
        this.logger.log(`${result.count} images soft deleted`);
        return { message: `${result.count} images deleted successfully` };
    }
    async restore(id) {
        const image = await this.prisma.image.findFirst({
            where: { id, isDeleted: true },
        });
        if (!image) {
            throw new common_1.NotFoundException('Deleted image not found');
        }
        await this.prisma.image.update({
            where: { id },
            data: {
                isDeleted: false,
                isActive: true,
                deletedAt: null,
            },
        });
        this.logger.log(`Image restored: ${image.originalName}`);
        return { message: 'Image restored successfully' };
    }
    async reorder(imageIds) {
        for (let i = 0; i < imageIds.length; i++) {
            await this.prisma.image.update({
                where: { id: imageIds[i] },
                data: { sortOrder: i },
            });
        }
        return { message: 'Images reordered successfully' };
    }
    validateImage(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (!upload_constants_1.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`Invalid file type. Allowed: ${upload_constants_1.ALLOWED_IMAGE_TYPES.join(', ')}`);
        }
    }
    async processAndSaveImage(file, folder) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const relativePath = `${folder}/${year}/${month}`;
        const dirPath = (0, path_1.join)(process.cwd(), this.uploadDir, relativePath);
        if (!(0, fs_1.existsSync)(dirPath)) {
            await (0, promises_1.mkdir)(dirPath, { recursive: true });
        }
        const uniqueId = this.generateId();
        const mainFilename = `${uniqueId}.webp`;
        const thumbFilename = `${uniqueId}-thumb.webp`;
        const mainPath = (0, path_1.join)(dirPath, mainFilename);
        const thumbPath = (0, path_1.join)(dirPath, thumbFilename);
        const sharpInstance = (0, sharp_1.default)(file.buffer);
        const metadata = await sharpInstance.metadata();
        let processedImage = sharpInstance;
        if (metadata.width && metadata.width > upload_constants_1.MAX_IMAGE_WIDTH) {
            processedImage = processedImage.resize(upload_constants_1.MAX_IMAGE_WIDTH, null, {
                withoutEnlargement: true,
            });
        }
        const mainBuffer = await processedImage
            .webp({ quality: upload_constants_1.IMAGE_QUALITY })
            .toBuffer();
        await (0, promises_1.writeFile)(mainPath, mainBuffer);
        const thumbBuffer = await (0, sharp_1.default)(file.buffer)
            .resize(upload_constants_1.THUMBNAIL_SIZE, upload_constants_1.THUMBNAIL_SIZE, { fit: 'cover' })
            .webp({ quality: 70 })
            .toBuffer();
        await (0, promises_1.writeFile)(thumbPath, thumbBuffer);
        const finalMeta = await (0, sharp_1.default)(mainBuffer).metadata();
        return {
            filename: mainFilename,
            path: `/${this.uploadDir}/${relativePath}/${mainFilename}`,
            url: `${this.baseUrl}/${this.uploadDir}/${relativePath}/${mainFilename}`,
            thumbnailUrl: `${this.baseUrl}/${this.uploadDir}/${relativePath}/${thumbFilename}`,
            width: finalMeta.width || 0,
            height: finalMeta.height || 0,
            size: mainBuffer.length,
        };
    }
    generateId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `${timestamp}-${random}`;
    }
    formatResponse(image) {
        return {
            id: image.id,
            originalName: image.originalName,
            url: image.url,
            thumbnailUrl: image.thumbnailUrl ?? undefined,
            width: image.width ?? undefined,
            height: image.height ?? undefined,
            size: image.size,
        };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = UploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], UploadService);
//# sourceMappingURL=upload.service.js.map