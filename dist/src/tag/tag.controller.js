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
exports.TagController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const tag_service_1 = require("./tag.service");
const tag_dto_1 = require("./dto/tag.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
let TagController = class TagController {
    TagService;
    constructor(TagService) {
        this.TagService = TagService;
    }
    create(dto, user) {
        return this.TagService.create(dto, user.id);
    }
    findAll() {
        return this.TagService.findAll();
    }
    findById(id) {
        return this.TagService.findById(id);
    }
    findBySlug(slug) {
        return this.TagService.findBySlug(slug);
    }
    update(id, dto, user) {
        return this.TagService.update(id, dto, user.id);
    }
    delete(id, user) {
        return this.TagService.delete(id, user.id);
    }
    restore(id, user) {
        return this.TagService.restore(id, user.id);
    }
};
exports.TagController = TagController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create tag',
        description: 'Create a new tag with name, logo, and SEO metadata. Requires MANAGE_PRODUCTS permission.||',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'tag created successfully',
        schema: {
            example: {
                success: true,
                message: 'tag created successfully',
                data: {
                    id: 'clxxxx1234567890',
                    name: 'Apple',
                    slug: 'apple',
                    logo: 'https://example.com/logos/apple.png',
                    description: 'American multinational technology company',
                    metaTitle: 'Apple Products - Buy iPhone, iPad, MacBook',
                    metaDescription: 'Shop the latest Apple products...',
                    isActive: true,
                    createdAt: '2024-01-28T10:00:00.000Z',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Missing MANAGE_PRODUCTS permission',
    }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'tag name or slug already exists' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tag_dto_1.CreateTagDto, Object]),
    __metadata("design:returntype", void 0)
], TagController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get All tags',
        description: 'Get list of all active tags. Requires VIEW_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'tags retrieved successfully',
        schema: {
            example: {
                success: true,
                message: 'tags retrieved successfully',
                data: [
                    {
                        id: 'clxxxx1234567890',
                        name: 'Apple',
                        slug: 'apple',
                        logo: 'https://example.com/logos/apple.png',
                        metaTitle: 'Apple Products',
                        metaDescription: 'Shop Apple products...',
                        isActive: true,
                    },
                    {
                        id: 'clyyyy9876543210',
                        name: 'Samsung',
                        slug: 'samsung',
                        logo: 'https://example.com/logos/samsung.png',
                        metaTitle: 'Samsung Products',
                        metaDescription: 'Shop Samsung products...',
                        isActive: true,
                    },
                ],
            },
        },
    }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TagController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get tag by ID',
        description: 'Get single tag by ID. Requires VIEW_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'tag ID',
        example: 'clxxxx1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'tag retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'tag not found' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TagController.prototype, "findById", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get tag by Slug',
        description: 'Get single tag by slug (SEO-friendly URL). Requires VIEW_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'slug',
        description: 'tag slug',
        example: 'apple',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'tag retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'tag not found' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)('slug/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TagController.prototype, "findBySlug", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update tag',
        description: 'Update tag details including name, logo, and SEO metadata. Requires MANAGE_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'tag ID',
        example: 'clxxxx1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'tag updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'tag not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'tag name or slug already exists' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tag_dto_1.UpdateTagDto, Object]),
    __metadata("design:returntype", void 0)
], TagController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete tag',
        description: 'Soft delete tag. Can be restored later. Requires MANAGE_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'tag ID',
        example: 'clxxxx1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'tag deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'tag not found' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TagController.prototype, "delete", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Restore Deleted tag',
        description: 'Restore a soft-deleted tag. Requires MANAGE_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'tag ID',
        example: 'clxxxx1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'tag restored successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Deleted tag not found' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Patch)(':id/restore'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TagController.prototype, "restore", null);
exports.TagController = TagController = __decorate([
    (0, swagger_1.ApiTags)('tags'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('tags'),
    __metadata("design:paramtypes", [tag_service_1.TagService])
], TagController);
//# sourceMappingURL=tag.controller.js.map