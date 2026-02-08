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
exports.BrandController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const brand_service_1 = require("./brand.service");
const brand_dto_1 = require("./dto/brand.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
let BrandController = class BrandController {
    brandService;
    constructor(brandService) {
        this.brandService = brandService;
    }
    create(dto, user) {
        return this.brandService.create(dto, user.id);
    }
    findAll() {
        return this.brandService.findAll();
    }
    findById(id) {
        return this.brandService.findById(id);
    }
    findBySlug(slug) {
        return this.brandService.findBySlug(slug);
    }
    update(id, dto, user) {
        return this.brandService.update(id, dto, user.id);
    }
    delete(id, user) {
        return this.brandService.delete(id, user.id);
    }
    restore(id, user) {
        return this.brandService.restore(id, user.id);
    }
};
exports.BrandController = BrandController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create Brand',
        description: 'Create a new brand with name, logo, and SEO metadata. Requires MANAGE_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Brand created successfully',
        schema: {
            example: {
                success: true,
                message: 'Brand created successfully',
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
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Missing MANAGE_PRODUCTS permission' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Brand name or slug already exists' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [brand_dto_1.CreateBrandDto, Object]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get All Brands',
        description: 'Get list of all active brands. Requires VIEW_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Brands retrieved successfully',
        schema: {
            example: {
                success: true,
                message: 'Brands retrieved successfully',
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
], BrandController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get Brand by ID',
        description: 'Get single brand by ID. Requires VIEW_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Brand ID',
        example: 'clxxxx1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Brand retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Brand not found' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "findById", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get Brand by Slug',
        description: 'Get single brand by slug (SEO-friendly URL). Requires VIEW_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'slug',
        description: 'Brand slug',
        example: 'apple',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Brand retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Brand not found' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)('slug/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "findBySlug", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update Brand',
        description: 'Update brand details including name, logo, and SEO metadata. Requires MANAGE_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Brand ID',
        example: 'clxxxx1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Brand updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Brand not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Brand name or slug already exists' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, brand_dto_1.UpdateBrandDto, Object]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete Brand',
        description: 'Soft delete brand. Can be restored later. Requires MANAGE_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Brand ID',
        example: 'clxxxx1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Brand deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Brand not found' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "delete", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Restore Deleted Brand',
        description: 'Restore a soft-deleted brand. Requires MANAGE_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Brand ID',
        example: 'clxxxx1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Brand restored successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Deleted brand not found' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Patch)(':id/restore'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "restore", null);
exports.BrandController = BrandController = __decorate([
    (0, swagger_1.ApiTags)('Brands'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('brands'),
    __metadata("design:paramtypes", [brand_service_1.BrandService])
], BrandController);
//# sourceMappingURL=brand.controller.js.map