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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const category_service_1 = require("./category.service");
const dto_1 = require("./dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
let CategoryController = class CategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    getCategoriesByLevel(level, parentId) {
        return this.categoryService.getCategoriesByLevel(level, parentId);
    }
    addCategoryToLevel(dto, user) {
        return this.categoryService.addCategoryToLevel(dto, user.id);
    }
    getLevelStatistics() {
        return this.categoryService.getLevelStatistics();
    }
    create(createCategoryDto, user) {
        return this.categoryService.create(createCategoryDto, user.id);
    }
    findAll(filters) {
        return this.categoryService.findAll(filters);
    }
    getTree() {
        return this.categoryService.getTree();
    }
    findOne(id) {
        return this.categoryService.findOne(id);
    }
    findBySlug(slug) {
        return this.categoryService.findBySlug(slug);
    }
    getChildren(id) {
        return this.categoryService.getChildren(id);
    }
    getBreadcrumb(id) {
        return this.categoryService.getBreadcrumb(id);
    }
    update(id, updateCategoryDto, user) {
        return this.categoryService.update(id, updateCategoryDto, user.id);
    }
    remove(id, user) {
        return this.categoryService.delete(id, user.id);
    }
    restore(id, user) {
        return this.categoryService.restore(id, user.id);
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get Categories by Level',
        description: 'Get all categories at a specific hierarchical level. Level 0 = root categories (Electronics, Clothing), Level 1 = main subcategories (Mobile, Laptop), Level 2+ = nested subcategories (iPhone, Samsung). Requires VIEW_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'level',
        description: 'Category level (0 = root, 1 = first level, etc.)',
        example: 1,
        type: Number,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'parentId',
        description: 'Optional: Filter by parent category ID to get children at specified level',
        required: false,
        example: 'clxxxx1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Categories retrieved successfully',
        schema: {
            example: {
                message: 'Categories at level 1 retrieved successfully',
                data: [
                    {
                        id: 'clxxxx001',
                        name: 'Mobile',
                        slug: 'electronics-mobile',
                        level: 1,
                        parentId: 'clxxxx000',
                        parent: {
                            id: 'clxxxx000',
                            name: 'Electronics',
                            slug: 'electronics',
                            level: 0,
                        },
                        childrenCount: 2,
                        isLeaf: false,
                    },
                    {
                        id: 'clxxxx002',
                        name: 'Laptop',
                        slug: 'electronics-laptop',
                        level: 1,
                        parentId: 'clxxxx000',
                        parent: {
                            id: 'clxxxx000',
                            name: 'Electronics',
                            slug: 'electronics',
                            level: 0,
                        },
                        childrenCount: 3,
                        isLeaf: false,
                    },
                ],
                meta: {
                    level: 1,
                    total: 2,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid level (must be 0-10)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Missing VIEW_PRODUCTS permission',
    }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)('level/:level'),
    __param(0, (0, common_1.Param)('level', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('parentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "getCategoriesByLevel", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Add Category to Specific Level',
        description: 'Create a new category at a specific level. For Level 0, no parent is needed. For Level 1+, parent from previous level is required. Example: To add "Laptop" at Level 1 under "Electronics" (Level 0), provide Electronics ID as parent. Requires MANAGE_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Category added successfully',
        schema: {
            example: {
                message: 'Category created successfully',
                data: {
                    id: 'clxxxx003',
                    name: 'PC',
                    slug: 'electronics-pc',
                    level: 1,
                    parentId: 'clxxxx000',
                    parent: {
                        id: 'clxxxx000',
                        name: 'Electronics',
                        slug: 'electronics',
                        level: 0,
                    },
                    path: '/electronics/electronics-pc',
                    isLeaf: true,
                    sortOrder: 3,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid data: level mismatch, missing parent, or parent at wrong level',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Missing MANAGE_PRODUCTS permission',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Slug already exists',
    }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Post)('add-to-level'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AddCategoryToLevelDto, Object]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "addCategoryToLevel", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get Level Statistics',
        description: 'Get count of categories at each level. Useful for understanding category hierarchy depth. Requires VIEW_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
        schema: {
            example: {
                message: 'Level statistics retrieved successfully',
                data: [
                    { level: 0, count: 3 },
                    { level: 1, count: 8 },
                    { level: 2, count: 15 },
                ],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Missing VIEW_PRODUCTS permission',
    }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)('level-stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "getLevelStatistics", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create New Category',
        description: 'Create a new category. Can be root (no parent) or child of existing category. Requires MANAGE_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Category created successfully',
        type: dto_1.CategoryResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid data or parent not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Missing MANAGE_PRODUCTS permission',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Slug already exists',
    }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateCategoryDto, Object]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get All Categories (Flat List)',
        description: 'Get paginated list of categories with filters. Returns flat structure. Requires VIEW_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Categories retrieved successfully',
        type: [dto_1.CategoryResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Missing VIEW_PRODUCTS permission',
    }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CategoryFilterDto]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get Full Category Tree',
        description: 'Get complete category hierarchy with nested children. Optimized for navigation menus. Requires VIEW_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Category tree retrieved successfully',
        type: [dto_1.CategoryTreeDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Missing VIEW_PRODUCTS permission',
    }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)('tree'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "getTree", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get Category by ID',
        description: 'Get single category details with parent and children info. Requires VIEW_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Category ID',
        example: 'clxxxx1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Category retrieved successfully',
        type: dto_1.CategoryResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Category not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Missing VIEW_PRODUCTS permission',
    }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get Category by Slug',
        description: 'Get category by URL-friendly slug. Requires VIEW_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'slug',
        description: 'Category slug',
        example: 'electronics-mobile',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Category retrieved successfully',
        type: dto_1.CategoryResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Category not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Missing VIEW_PRODUCTS permission',
    }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)('slug/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "findBySlug", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get Category Children',
        description: 'Get direct children of a category. Requires VIEW_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Parent category ID',
        example: 'clxxxx1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Children retrieved successfully',
        type: [dto_1.CategoryResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Category not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Missing VIEW_PRODUCTS permission',
    }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)(':id/children'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "getChildren", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get Category Breadcrumb',
        description: 'Get breadcrumb trail from root to category. Useful for navigation. Requires VIEW_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Category ID',
        example: 'clxxxx1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Breadcrumb retrieved successfully',
        type: [dto_1.BreadcrumbItemDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Category not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Missing VIEW_PRODUCTS permission',
    }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)(':id/breadcrumb'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "getBreadcrumb", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update Category',
        description: 'Update category details. Can move category to different parent. Requires MANAGE_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Category ID',
        example: 'clxxxx1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Category updated successfully',
        type: dto_1.CategoryResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Category not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid data or circular reference',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Missing MANAGE_PRODUCTS permission',
    }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateCategoryDto, Object]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete Category',
        description: 'Soft delete category. Cannot delete if has active children. Requires MANAGE_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Category ID',
        example: 'clxxxx1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Category deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Category not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Category has active children',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Missing MANAGE_PRODUCTS permission',
    }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Restore Deleted Category',
        description: 'Restore a soft-deleted category. Parent must be active. Requires MANAGE_PRODUCTS permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Category ID',
        example: 'clxxxx1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Category restored successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Deleted category not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Parent category is deleted or inactive',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Missing MANAGE_PRODUCTS permission',
    }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Patch)(':id/restore'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "restore", null);
exports.CategoryController = CategoryController = __decorate([
    (0, swagger_1.ApiTags)('Categories'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
//# sourceMappingURL=category.controller.js.map