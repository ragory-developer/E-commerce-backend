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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const multer_1 = require("multer");
const upload_service_1 = require("./upload.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const dto_1 = require("./dto");
const upload_constants_1 = require("./upload.constants");
const uploadConfig = {
    storage: (0, multer_1.memoryStorage)(),
    limits: { fileSize: upload_constants_1.MAX_FILE_SIZE },
};
let UploadController = class UploadController {
    uploadService;
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async uploadSingle(file, folder = 'general', alt, user) {
        const result = await this.uploadService.uploadImage(file, {
            folder,
            alt,
            createdBy: user?.id,
        });
        return {
            message: 'Image uploaded successfully',
            data: result,
        };
    }
    async uploadMultiple(files, folder = 'general', alt, user) {
        const results = await this.uploadService.uploadImages(files, {
            folder,
            alt,
            createdBy: user?.id,
        });
        return {
            message: `${results.length} images uploaded successfully`,
            data: results,
        };
    }
    findAll(folder) {
        return this.uploadService.findAll(folder);
    }
    findById(id) {
        return this.uploadService.findById(id);
    }
    softDelete(id) {
        return this.uploadService.softDelete(id);
    }
    softDeleteMany(dto) {
        return this.uploadService.softDeleteMany(dto.imageIds);
    }
    restore(id) {
        return this.uploadService.restore(id);
    }
    reorder(dto) {
        return this.uploadService.reorder(dto.imageIds);
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Upload Single Image',
        description: 'Upload a single image. Automatically converts to WebP and generates thumbnail.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file (JPG, PNG, GIF, WebP)',
                },
            },
            required: ['file'],
        },
    }),
    (0, swagger_1.ApiQuery)({
        name: 'folder',
        required: false,
        enum: upload_constants_1.VALID_FOLDERS,
        description: 'Folder to organize image',
        example: 'product',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'alt',
        required: false,
        description: 'Alt text for SEO',
        example: 'Red Nike Shoes',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Image uploaded successfully',
        schema: {
            example: {
                message: 'Image uploaded successfully',
                data: {
                    id: 'clxxxx123',
                    originalName: 'product.jpg',
                    url: 'https://yourdomain.com/uploads/product/2026/02/abc123.webp',
                    thumbnailUrl: 'https://yourdomain.com/uploads/product/2026/02/abc123-thumb.webp',
                    width: 1200,
                    height: 800,
                    size: 45000,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid file type or no file provided',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Missing MANAGE_PRODUCTS permission',
    }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', uploadConfig)),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: upload_constants_1.MAX_FILE_SIZE }),
            new common_1.FileTypeValidator({ fileType: /image\/(jpeg|png|gif|webp)/ }),
        ],
    }))),
    __param(1, (0, common_1.Query)('folder')),
    __param(2, (0, common_1.Query)('alt')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadSingle", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Upload Multiple Images',
        description: `Upload up to ${upload_constants_1.MAX_FILES_COUNT} images at once. Perfect for product galleries.`,
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: `Image files (max ${upload_constants_1.MAX_FILES_COUNT})`,
                },
            },
            required: ['files'],
        },
    }),
    (0, swagger_1.ApiQuery)({
        name: 'folder',
        required: false,
        enum: upload_constants_1.VALID_FOLDERS,
        example: 'product',
    }),
    (0, swagger_1.ApiQuery)({ name: 'alt', required: false }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Images uploaded successfully',
    }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Post)('multiple'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', upload_constants_1.MAX_FILES_COUNT, uploadConfig)),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Query)('folder')),
    __param(2, (0, common_1.Query)('alt')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, String, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadMultiple", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get All Images',
        description: 'Get all uploaded images. Filter by folder.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'folder', required: false, enum: upload_constants_1.VALID_FOLDERS }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Images retrieved successfully' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Image by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Image ID (CUID)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Image not found' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "findById", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Soft Delete Image',
        description: 'Mark image as deleted. File remains on server for recovery.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Image ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Image not found' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "softDelete", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Soft Delete Multiple Images',
        description: 'Delete multiple images at once.',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.DeleteImagesDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Images deleted successfully' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Delete)('bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.DeleteImagesDto]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "softDeleteMany", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Restore Deleted Image' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Image ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image restored successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Deleted image not found' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Patch)(':id/restore'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "restore", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Reorder Images',
        description: 'Update the display order of images (for galleries).',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.ReorderImagesDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Images reordered successfully' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Patch)('reorder'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ReorderImagesDto]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "reorder", null);
exports.UploadController = UploadController = __decorate([
    (0, swagger_1.ApiTags)('Upload'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map