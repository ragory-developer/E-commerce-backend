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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryResponseDto = exports.CategoryTreeDto = exports.BreadcrumbItemDto = exports.CategoryFilterDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CategoryFilterDto {
    parentId;
    level;
    isActive;
    includeDeleted;
    search;
    page = 1;
    limit = 20;
}
exports.CategoryFilterDto = CategoryFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by parent category ID',
        example: 'clxxxx1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CategoryFilterDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by level (0 = root)',
        example: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CategoryFilterDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by active status',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CategoryFilterDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include deleted categories',
        example: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CategoryFilterDto.prototype, "includeDeleted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search by name, slug, or description',
        example: 'electronics',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CategoryFilterDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number',
        example: 1,
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CategoryFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Items per page',
        example: 20,
        default: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CategoryFilterDto.prototype, "limit", void 0);
class BreadcrumbItemDto {
    id;
    name;
    slug;
    level;
}
exports.BreadcrumbItemDto = BreadcrumbItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clxxxx1234567890' }),
    __metadata("design:type", String)
], BreadcrumbItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Electronics' }),
    __metadata("design:type", String)
], BreadcrumbItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'electronics' }),
    __metadata("design:type", String)
], BreadcrumbItemDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    __metadata("design:type", Number)
], BreadcrumbItemDto.prototype, "level", void 0);
class CategoryTreeDto {
    id;
    name;
    slug;
    parentId;
    path;
    level;
    isLeaf;
    description;
    image;
    icon;
    sortOrder;
    isActive;
    children;
    createdAt;
    updatedAt;
}
exports.CategoryTreeDto = CategoryTreeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clxxxx1234567890' }),
    __metadata("design:type", String)
], CategoryTreeDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Electronics' }),
    __metadata("design:type", String)
], CategoryTreeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'electronics' }),
    __metadata("design:type", String)
], CategoryTreeDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clxxxx0987654321', nullable: true }),
    __metadata("design:type", Object)
], CategoryTreeDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '/electronics' }),
    __metadata("design:type", String)
], CategoryTreeDto.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    __metadata("design:type", Number)
], CategoryTreeDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], CategoryTreeDto.prototype, "isLeaf", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'All electronic items', nullable: true }),
    __metadata("design:type", String)
], CategoryTreeDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/images/electronics.jpg',
        nullable: true,
    }),
    __metadata("design:type", String)
], CategoryTreeDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'icon-electronics', nullable: true }),
    __metadata("design:type", String)
], CategoryTreeDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], CategoryTreeDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], CategoryTreeDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CategoryTreeDto] }),
    __metadata("design:type", Array)
], CategoryTreeDto.prototype, "children", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-28T10:00:00.000Z' }),
    __metadata("design:type", Date)
], CategoryTreeDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-28T10:00:00.000Z' }),
    __metadata("design:type", Date)
], CategoryTreeDto.prototype, "updatedAt", void 0);
class CategoryResponseDto {
    id;
    name;
    slug;
    parentId;
    path;
    level;
    isLeaf;
    description;
    image;
    icon;
    sortOrder;
    isActive;
    createdAt;
    updatedAt;
    childrenCount;
}
exports.CategoryResponseDto = CategoryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clxxxx1234567890' }),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Electronics' }),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'electronics' }),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clxxxx0987654321', nullable: true }),
    __metadata("design:type", Object)
], CategoryResponseDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '/electronics' }),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    __metadata("design:type", Number)
], CategoryResponseDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], CategoryResponseDto.prototype, "isLeaf", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'All electronic items', nullable: true }),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/images/electronics.jpg',
        nullable: true,
    }),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'icon-electronics', nullable: true }),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], CategoryResponseDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], CategoryResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-28T10:00:00.000Z' }),
    __metadata("design:type", Date)
], CategoryResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-28T10:00:00.000Z' }),
    __metadata("design:type", Date)
], CategoryResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Number of direct children' }),
    __metadata("design:type", Number)
], CategoryResponseDto.prototype, "childrenCount", void 0);
//# sourceMappingURL=category-filter.dto.js.map