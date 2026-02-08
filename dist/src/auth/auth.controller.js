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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const auth_service_1 = require("./auth.service");
const dto_1 = require("./dto");
const response_dto_1 = require("./dto/response.dto");
const public_decorator_1 = require("../common/decorators/public.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_ip_decorator_1 = require("../common/decorators/client-ip.decorator");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    adminLogin(dto, ipAddress) {
        return this.authService.adminLogin(dto, ipAddress);
    }
    createAdmin(dto, currentUser) {
        return this.authService.createAdmin(dto, currentUser);
    }
    getAllAdmins(filterDto, currentUser) {
        return this.authService.getAllAdmins(currentUser, filterDto);
    }
    updateAdminPermissions(adminId, dto, currentUser) {
        return this.authService.updateAdminPermissions(adminId, dto.permissions, currentUser);
    }
    disableAdmin(adminId, currentUser) {
        return this.authService.disableAdmin(adminId, currentUser);
    }
    enableAdmin(adminId, currentUser) {
        return this.authService.enableAdmin(adminId, currentUser);
    }
    deleteAdmin(adminId, currentUser) {
        return this.authService.deleteAdmin(adminId, currentUser);
    }
    customerRegister(dto, ipAddress) {
        return this.authService.customerRegister(dto, ipAddress);
    }
    customerLogin(dto, ipAddress) {
        return this.authService.customerLogin(dto, ipAddress);
    }
    refreshTokens(dto) {
        return this.authService.refreshTokens(dto.refreshToken);
    }
    logout(user) {
        return this.authService.logout(user.id, user.userType);
    }
    logoutAll(user) {
        return this.authService.logoutAll(user.id, user.userType);
    }
    getProfile(user) {
        return {
            message: 'Profile retrieved successfully',
            data: user,
        };
    }
    changePassword(dto, user) {
        return this.authService.changePassword(user.id, user.userType, dto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Admin Login',
        description: 'Authenticate admin user with email and password to receive JWT tokens (access + refresh)',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.AdminLoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login successful - Returns access token and refresh token',
        type: response_dto_1.LoginResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid credentials or account inactive/deleted',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error',
        type: response_dto_1.ValidationErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 429,
        description: 'Too many login attempts - Rate limit exceeded',
    }),
    (0, public_decorator_1.Public)(),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Post)('admin/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, client_ip_decorator_1.ClientIp)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AdminLoginDto, String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "adminLogin", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create New Admin',
        description: 'SuperAdmin can create new admin accounts with specific roles and permissions. Cannot create another SuperAdmin.',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.CreateAdminDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Admin account created successfully',
        type: response_dto_1.AdminCreatedResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Only SuperAdmin can create admins',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Email already exists',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error',
        type: response_dto_1.ValidationErrorResponseDto,
    }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPERADMIN),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 3600000 } }),
    (0, common_1.Post)('admin/create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateAdminDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "createAdmin", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'List All Admins',
        description: 'Get paginated list of all admin accounts with optional filters (role, search, active status)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Admins retrieved successfully with pagination metadata',
        type: response_dto_1.AdminListResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Only SuperAdmin can view admin list',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPERADMIN),
    (0, common_1.Get)('admin/list'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AdminFilterDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getAllAdmins", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update Admin Permissions',
        description: 'SuperAdmin can modify permissions for any admin (except other SuperAdmins). All active tokens will be revoked.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'adminId',
        description: 'Target admin ID (cuid format)',
        example: 'clxxxx1234567890',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.UpdatePermissionsDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Permissions updated successfully',
        type: response_dto_1.AdminUpdatedResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Cannot modify SuperAdmin permissions',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Admin not found or deleted',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPERADMIN),
    (0, common_1.Patch)('admin/:adminId/permissions'),
    __param(0, (0, common_1.Param)('adminId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdatePermissionsDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "updateAdminPermissions", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Disable Admin Account',
        description: 'SuperAdmin can disable admin account (soft disable). All tokens will be revoked. Cannot disable own account or SuperAdmin.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'adminId',
        description: 'Target admin ID',
        example: 'clxxxx1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Admin disabled successfully',
        type: response_dto_1.AdminUpdatedResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Cannot disable own account or SuperAdmin',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Admin not found',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPERADMIN),
    (0, common_1.Patch)('admin/:adminId/disable'),
    __param(0, (0, common_1.Param)('adminId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "disableAdmin", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Enable Admin Account',
        description: 'SuperAdmin can re-enable previously disabled admin account',
    }),
    (0, swagger_1.ApiParam)({
        name: 'adminId',
        description: 'Target admin ID',
        example: 'clxxxx1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Admin enabled successfully',
        type: response_dto_1.AdminUpdatedResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Admin not found',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPERADMIN),
    (0, common_1.Patch)('admin/:adminId/enable'),
    __param(0, (0, common_1.Param)('adminId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "enableAdmin", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete Admin Account',
        description: 'SuperAdmin can soft delete admin account (sets isDeleted = true, isActive = false). All tokens will be revoked. Cannot delete own account or SuperAdmin.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'adminId',
        description: 'Target admin ID',
        example: 'clxxxx1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Admin deleted successfully',
        type: response_dto_1.AdminUpdatedResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Cannot delete own account or SuperAdmin',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Admin not found',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPERADMIN),
    (0, common_1.Delete)('admin/:adminId'),
    __param(0, (0, common_1.Param)('adminId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "deleteAdmin", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Customer Registration',
        description: 'Create new customer account. Phone is required and must be unique. Email and password are optional for guest checkout.',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.CustomerRegisterDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Customer account created successfully with tokens',
        type: response_dto_1.LoginResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Phone or email already exists',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error',
        type: response_dto_1.ValidationErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 429,
        description: 'Too many registration attempts',
    }),
    (0, public_decorator_1.Public)(),
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 60000 } }),
    (0, common_1.Post)('customer/register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, client_ip_decorator_1.ClientIp)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CustomerRegisterDto, String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "customerRegister", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Customer Login',
        description: 'Login with email or phone + password. Provide either email or phone.',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.CustomerLoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login successful',
        type: response_dto_1.LoginResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid credentials or account inactive',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error',
        type: response_dto_1.ValidationErrorResponseDto,
    }),
    (0, public_decorator_1.Public)(),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Post)('customer/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, client_ip_decorator_1.ClientIp)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CustomerLoginDto, String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "customerLogin", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh Access Token',
        description: 'Get new access token using valid refresh token. Token rotation is applied - old refresh token will be revoked.',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.RefreshTokenDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tokens refreshed successfully with new token pair',
        type: response_dto_1.LoginResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid or expired refresh token',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.RefreshTokenDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refreshTokens", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Logout Current Session',
        description: 'Revoke current session tokens (requires authentication)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Logged out successfully',
        type: response_dto_1.MessageResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Not authenticated',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Logout All Sessions',
        description: 'Revoke ALL tokens for current user across all devices (requires authentication)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'All sessions logged out',
        type: response_dto_1.MessageResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Not authenticated',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Post)('logout-all'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logoutAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get Current User Profile',
        description: 'Retrieve authenticated user information (Admin or Customer)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile retrieved successfully',
        type: response_dto_1.ProfileResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Not authenticated',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Change Password',
        description: 'Change current user password. Requires current password for verification. All sessions will be logged out after password change.',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.ChangePasswordDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password changed successfully - All sessions logged out',
        type: response_dto_1.MessageResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Current password incorrect or not authenticated',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error or new password same as current',
        type: response_dto_1.ValidationErrorResponseDto,
    }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Patch)('change-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ChangePasswordDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "changePassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map