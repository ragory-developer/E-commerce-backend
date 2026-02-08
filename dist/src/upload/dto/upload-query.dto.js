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
exports.UploadQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const upload_constants_1 = require("../upload.constants");
class UploadQueryDto {
    folder;
    alt;
}
exports.UploadQueryDto = UploadQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Folder to store image',
        enum: upload_constants_1.VALID_FOLDERS,
        example: 'product',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)([...upload_constants_1.VALID_FOLDERS]),
    __metadata("design:type", String)
], UploadQueryDto.prototype, "folder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Alt text for SEO',
        example: 'Red Nike Running Shoes',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UploadQueryDto.prototype, "alt", void 0);
//# sourceMappingURL=upload-query.dto.js.map