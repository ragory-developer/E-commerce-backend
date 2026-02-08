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
exports.ImageResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ImageResponseDto {
    id;
    originalName;
    url;
    thumbnailUrl;
    width;
    height;
    size;
}
exports.ImageResponseDto = ImageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clxxxx1234567890' }),
    __metadata("design:type", String)
], ImageResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'product-photo.jpg' }),
    __metadata("design:type", String)
], ImageResponseDto.prototype, "originalName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://yourdomain.com/uploads/product/2026/02/abc123.webp',
    }),
    __metadata("design:type", String)
], ImageResponseDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://yourdomain.com/uploads/product/2026/02/abc123-thumb.webp',
    }),
    __metadata("design:type", String)
], ImageResponseDto.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1200 }),
    __metadata("design:type", Number)
], ImageResponseDto.prototype, "width", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 800 }),
    __metadata("design:type", Number)
], ImageResponseDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 45000 }),
    __metadata("design:type", Number)
], ImageResponseDto.prototype, "size", void 0);
//# sourceMappingURL=image-response.dto.js.map