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
exports.ValidationErrorResponseDto = exports.ErrorResponseDto = exports.ProfileResponseDto = exports.AdminUpdatedResponseDto = exports.MessageResponseDto = exports.AdminListResponseDto = exports.AdminListMetaDto = exports.AdminCreatedResponseDto = exports.AdminResponseDto = exports.LoginResponseDto = exports.TokenDataDto = exports.UserResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class UserResponseDto {
    id;
    email;
    firstName;
    lastName;
    role;
    permissions;
}
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clxxxx1234567890' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'john.doe@company.com' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Doe' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.Role, example: client_1.Role.ADMIN }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.Permission,
        isArray: true,
        example: [client_1.Permission.MANAGE_PRODUCTS, client_1.Permission.MANAGE_ORDERS],
    }),
    __metadata("design:type", Array)
], UserResponseDto.prototype, "permissions", void 0);
class TokenDataDto {
    accessToken;
    refreshToken;
    user;
}
exports.TokenDataDto = TokenDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbHh4eHh4IiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIn0.example',
    }),
    __metadata("design:type", String)
], TokenDataDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbHh4eHh4IiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIn0.refresh',
    }),
    __metadata("design:type", String)
], TokenDataDto.prototype, "refreshToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: UserResponseDto }),
    __metadata("design:type", UserResponseDto)
], TokenDataDto.prototype, "user", void 0);
class LoginResponseDto {
    message;
    data;
}
exports.LoginResponseDto = LoginResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Login successful' }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: TokenDataDto }),
    __metadata("design:type", TokenDataDto)
], LoginResponseDto.prototype, "data", void 0);
class AdminResponseDto {
    id;
    firstName;
    lastName;
    email;
    phone;
    role;
    permissions;
    isActive;
    createdAt;
    lastLoginAt;
}
exports.AdminResponseDto = AdminResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clxxxx1234567890' }),
    __metadata("design:type", String)
], AdminResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John' }),
    __metadata("design:type", String)
], AdminResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Doe' }),
    __metadata("design:type", String)
], AdminResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'john.doe@company.com' }),
    __metadata("design:type", String)
], AdminResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+8801712345678', required: false }),
    __metadata("design:type", String)
], AdminResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.Role, example: client_1.Role.ADMIN }),
    __metadata("design:type", String)
], AdminResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.Permission,
        isArray: true,
        example: [client_1.Permission.MANAGE_PRODUCTS],
    }),
    __metadata("design:type", Array)
], AdminResponseDto.prototype, "permissions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], AdminResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-28T10:00:00.000Z' }),
    __metadata("design:type", Date)
], AdminResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-28T10:00:00.000Z', required: false }),
    __metadata("design:type", Date)
], AdminResponseDto.prototype, "lastLoginAt", void 0);
class AdminCreatedResponseDto {
    message;
    data;
}
exports.AdminCreatedResponseDto = AdminCreatedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Admin created successfully' }),
    __metadata("design:type", String)
], AdminCreatedResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AdminResponseDto }),
    __metadata("design:type", AdminResponseDto)
], AdminCreatedResponseDto.prototype, "data", void 0);
class AdminListMetaDto {
    total;
    page;
    limit;
    totalPages;
}
exports.AdminListMetaDto = AdminListMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25 }),
    __metadata("design:type", Number)
], AdminListMetaDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], AdminListMetaDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], AdminListMetaDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], AdminListMetaDto.prototype, "totalPages", void 0);
class AdminListResponseDto {
    message;
    data;
    meta;
}
exports.AdminListResponseDto = AdminListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Admins retrieved successfully' }),
    __metadata("design:type", String)
], AdminListResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AdminResponseDto] }),
    __metadata("design:type", Array)
], AdminListResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AdminListMetaDto }),
    __metadata("design:type", AdminListMetaDto)
], AdminListResponseDto.prototype, "meta", void 0);
class MessageResponseDto {
    message;
}
exports.MessageResponseDto = MessageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Operation successful' }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "message", void 0);
class AdminUpdatedResponseDto {
    message;
    data;
}
exports.AdminUpdatedResponseDto = AdminUpdatedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Admin updated successfully' }),
    __metadata("design:type", String)
], AdminUpdatedResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AdminResponseDto }),
    __metadata("design:type", AdminResponseDto)
], AdminUpdatedResponseDto.prototype, "data", void 0);
class ProfileResponseDto {
    message;
    data;
}
exports.ProfileResponseDto = ProfileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Profile retrieved successfully' }),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: UserResponseDto }),
    __metadata("design:type", UserResponseDto)
], ProfileResponseDto.prototype, "data", void 0);
class ErrorResponseDto {
    statusCode;
    message;
    error;
}
exports.ErrorResponseDto = ErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 401 }),
    __metadata("design:type", Number)
], ErrorResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Invalid credentials' }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Unauthorized' }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "error", void 0);
class ValidationErrorResponseDto {
    statusCode;
    message;
    error;
}
exports.ValidationErrorResponseDto = ValidationErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 400 }),
    __metadata("design:type", Number)
], ValidationErrorResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['email must be a valid email', 'password is too short'],
        isArray: true,
    }),
    __metadata("design:type", Array)
], ValidationErrorResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bad Request' }),
    __metadata("design:type", String)
], ValidationErrorResponseDto.prototype, "error", void 0);
//# sourceMappingURL=response.dto.js.map