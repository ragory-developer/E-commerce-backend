"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcryptjs"));
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const constants_1 = require("../common/constants");
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    configService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async adminLogin(dto, ipAddress) {
        const admin = await this.prisma.admin.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (!admin) {
            throw new common_1.UnauthorizedException(constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
        if (admin.isDeleted || !admin.isActive) {
            throw new common_1.UnauthorizedException(constants_1.ERROR_MESSAGES.USER_INACTIVE);
        }
        const isPasswordValid = await bcrypt.compare(dto.password, admin.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException(constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
        const tokens = this.generateTokens({
            sub: admin.id,
            email: admin.email,
            userType: client_1.AuthUserType.ADMIN,
            role: admin.role,
            permissions: admin.permissions,
        });
        await this.saveRefreshToken(admin.id, client_1.AuthUserType.ADMIN, tokens.refreshToken, ipAddress);
        await this.prisma.admin.update({
            where: { id: admin.id },
            data: {
                lastLoginAt: new Date(),
                lastLoginIp: ipAddress,
            },
        });
        this.logger.log(`Admin logged in: ${admin.email} from ${ipAddress}`);
        return {
            message: constants_1.SUCCESS_MESSAGES.LOGIN_SUCCESS,
            data: {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: {
                    id: admin.id,
                    email: admin.email,
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    role: admin.role,
                    permissions: admin.permissions,
                },
            },
        };
    }
    async createAdmin(dto, currentUser) {
        if (currentUser.role !== client_1.Role.SUPERADMIN) {
            throw new common_1.ForbiddenException(constants_1.ERROR_MESSAGES.ONLY_SUPERADMIN);
        }
        if (dto.role === client_1.Role.SUPERADMIN) {
            throw new common_1.ForbiddenException('Cannot create another SuperAdmin');
        }
        const existingAdmin = await this.prisma.admin.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (existingAdmin) {
            throw new common_1.ConflictException(constants_1.ERROR_MESSAGES.EMAIL_EXISTS);
        }
        const saltRounds = this.configService.get('security.bcryptRounds') ?? 12;
        const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
        const result = await this.prisma.$transaction(async (tx) => {
            const admin = await tx.admin.create({
                data: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email.toLowerCase(),
                    password: hashedPassword,
                    phone: dto.phone,
                    role: dto.role || client_1.Role.ADMIN,
                    permissions: dto.permissions || [],
                    createdBy: currentUser.id,
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    role: true,
                    permissions: true,
                    createdAt: true,
                },
            });
            await this.createAuditLog(tx, {
                actorRole: currentUser.role,
                actorId: currentUser.id,
                action: 'CREATE_ADMIN',
                model: 'Admin',
                recordId: admin.id,
                newData: {
                    email: admin.email,
                    role: admin.role,
                    permissions: admin.permissions,
                },
            });
            return admin;
        });
        this.logger.log(`Admin created: ${result.email} by ${currentUser.email}`);
        return {
            message: constants_1.SUCCESS_MESSAGES.ADMIN_CREATED,
            data: result,
        };
    }
    async getAllAdmins(currentUser, filters) {
        if (currentUser.role !== client_1.Role.SUPERADMIN) {
            throw new common_1.ForbiddenException(constants_1.ERROR_MESSAGES.ONLY_SUPERADMIN);
        }
        const { page = 1, limit = 10, role, search, isActive } = filters;
        const skip = (page - 1) * limit;
        const where = { isDeleted: false };
        if (role) {
            where.role = role;
        }
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [admins, total] = await Promise.all([
            this.prisma.admin.findMany({
                where,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    role: true,
                    permissions: true,
                    isActive: true,
                    lastLoginAt: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.admin.count({ where }),
        ]);
        return {
            message: 'Admins retrieved successfully',
            data: admins,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async updateAdminPermissions(adminId, permissions, currentUser) {
        if (currentUser.role !== client_1.Role.SUPERADMIN) {
            throw new common_1.ForbiddenException(constants_1.ERROR_MESSAGES.ONLY_SUPERADMIN);
        }
        const admin = await this.prisma.admin.findFirst({
            where: { id: adminId, isDeleted: false },
        });
        if (!admin) {
            throw new common_1.BadRequestException(constants_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        if (admin.role === client_1.Role.SUPERADMIN) {
            throw new common_1.ForbiddenException(constants_1.ERROR_MESSAGES.CANNOT_MODIFY_SUPERADMIN);
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.admin.update({
                where: { id: adminId },
                data: {
                    permissions: {
                        set: permissions,
                    },
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true,
                    permissions: true,
                },
            });
            await this.createAuditLog(tx, {
                actorRole: currentUser.role,
                actorId: currentUser.id,
                action: 'UPDATE_PERMISSIONS',
                model: 'Admin',
                recordId: adminId,
                oldData: { permissions: admin.permissions },
                newData: { permissions },
            });
            return updated;
        });
        await this.revokeAllUserTokens(adminId, client_1.AuthUserType.ADMIN);
        this.logger.log(`Admin permissions updated: ${admin.email} by ${currentUser.email}`);
        return {
            message: 'Permissions updated successfully',
            data: result,
        };
    }
    async disableAdmin(adminId, currentUser) {
        if (currentUser.role !== client_1.Role.SUPERADMIN) {
            throw new common_1.ForbiddenException(constants_1.ERROR_MESSAGES.ONLY_SUPERADMIN);
        }
        if (adminId === currentUser.id) {
            throw new common_1.ForbiddenException('Cannot disable your own account');
        }
        const admin = await this.prisma.admin.findFirst({
            where: { id: adminId, isDeleted: false },
        });
        if (!admin) {
            throw new common_1.BadRequestException(constants_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        if (admin.role === client_1.Role.SUPERADMIN) {
            throw new common_1.ForbiddenException(constants_1.ERROR_MESSAGES.CANNOT_MODIFY_SUPERADMIN);
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.admin.update({
                where: { id: adminId },
                data: { isActive: false },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    isActive: true,
                },
            });
            await this.createAuditLog(tx, {
                actorRole: currentUser.role,
                actorId: currentUser.id,
                action: 'DISABLE_ADMIN',
                model: 'Admin',
                recordId: adminId,
                oldData: { isActive: admin.isActive },
                newData: { isActive: false },
            });
            return updated;
        });
        await this.revokeAllUserTokens(adminId, client_1.AuthUserType.ADMIN);
        this.logger.log(`Admin disabled: ${admin.email} by ${currentUser.email}`);
        return {
            message: 'Admin disabled successfully',
            data: result,
        };
    }
    async enableAdmin(adminId, currentUser) {
        if (currentUser.role !== client_1.Role.SUPERADMIN) {
            throw new common_1.ForbiddenException(constants_1.ERROR_MESSAGES.ONLY_SUPERADMIN);
        }
        const admin = await this.prisma.admin.findFirst({
            where: { id: adminId, isDeleted: false },
        });
        if (!admin) {
            throw new common_1.BadRequestException(constants_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.admin.update({
                where: { id: adminId },
                data: { isActive: true },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    isActive: true,
                },
            });
            await this.createAuditLog(tx, {
                actorRole: currentUser.role,
                actorId: currentUser.id,
                action: 'ENABLE_ADMIN',
                model: 'Admin',
                recordId: adminId,
                oldData: { isActive: admin.isActive },
                newData: { isActive: true },
            });
            return updated;
        });
        this.logger.log(`Admin enabled: ${admin.email} by ${currentUser.email}`);
        return {
            message: 'Admin enabled successfully',
            data: result,
        };
    }
    async deleteAdmin(adminId, currentUser) {
        if (currentUser.role !== client_1.Role.SUPERADMIN) {
            throw new common_1.ForbiddenException(constants_1.ERROR_MESSAGES.ONLY_SUPERADMIN);
        }
        if (adminId === currentUser.id) {
            throw new common_1.ForbiddenException('Cannot delete your own account');
        }
        const admin = await this.prisma.admin.findFirst({
            where: { id: adminId, isDeleted: false },
        });
        if (!admin) {
            throw new common_1.BadRequestException(constants_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        if (admin.role === client_1.Role.SUPERADMIN) {
            throw new common_1.ForbiddenException(constants_1.ERROR_MESSAGES.CANNOT_MODIFY_SUPERADMIN);
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const deleted = await tx.admin.update({
                where: { id: adminId },
                data: {
                    isDeleted: true,
                    isActive: false,
                    deletedAt: new Date(),
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    isDeleted: true,
                },
            });
            await this.createAuditLog(tx, {
                actorRole: currentUser.role,
                actorId: currentUser.id,
                action: 'DELETE_ADMIN',
                model: 'Admin',
                recordId: adminId,
                oldData: {
                    isDeleted: admin.isDeleted,
                    isActive: admin.isActive,
                },
                newData: {
                    isDeleted: true,
                    isActive: false,
                },
            });
            return deleted;
        });
        await this.revokeAllUserTokens(adminId, client_1.AuthUserType.ADMIN);
        this.logger.log(`Admin deleted: ${admin.email} by ${currentUser.email}`);
        return {
            message: 'Admin deleted successfully',
            data: result,
        };
    }
    async customerRegister(dto, ipAddress) {
        const existingByPhone = await this.prisma.customer.findUnique({
            where: { phone: dto.phone },
        });
        if (existingByPhone) {
            throw new common_1.ConflictException(constants_1.ERROR_MESSAGES.PHONE_EXISTS);
        }
        if (dto.email) {
            const existingByEmail = await this.prisma.customer.findUnique({
                where: { email: dto.email.toLowerCase() },
            });
            if (existingByEmail) {
                throw new common_1.ConflictException(constants_1.ERROR_MESSAGES.EMAIL_EXISTS);
            }
        }
        let hashedPassword = null;
        if (dto.password) {
            const saltRounds = this.configService.get('security.bcryptRounds') ?? 12;
            hashedPassword = await bcrypt.hash(dto.password, saltRounds);
        }
        const customer = await this.prisma.customer.create({
            data: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email?.toLowerCase(),
                phone: dto.phone,
                password: hashedPassword,
                lastLoginIp: ipAddress,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                createdAt: true,
            },
        });
        const tokens = this.generateTokens({
            sub: customer.id,
            email: customer.email,
            userType: client_1.AuthUserType.CUSTOMER,
        });
        await this.saveRefreshToken(customer.id, client_1.AuthUserType.CUSTOMER, tokens.refreshToken, ipAddress);
        this.logger.log(`Customer registered: ${customer.phone} from ${ipAddress}`);
        return {
            message: constants_1.SUCCESS_MESSAGES.REGISTER_SUCCESS,
            data: {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: customer,
            },
        };
    }
    async customerLogin(dto, ipAddress) {
        const customer = await this.prisma.customer.findFirst({
            where: {
                OR: [
                    dto.email ? { email: dto.email.toLowerCase() } : {},
                    dto.phone ? { phone: dto.phone } : {},
                ],
            },
        });
        if (!customer) {
            throw new common_1.UnauthorizedException(constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
        if (customer.isDeleted || !customer.isActive) {
            throw new common_1.UnauthorizedException(constants_1.ERROR_MESSAGES.USER_INACTIVE);
        }
        if (!customer.password) {
            throw new common_1.UnauthorizedException('No password set. Please register or use another login method');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, customer.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException(constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
        const tokens = this.generateTokens({
            sub: customer.id,
            email: customer.email || customer.phone,
            userType: client_1.AuthUserType.CUSTOMER,
        });
        await this.saveRefreshToken(customer.id, client_1.AuthUserType.CUSTOMER, tokens.refreshToken, ipAddress);
        await this.prisma.customer.update({
            where: { id: customer.id },
            data: {
                lastLoginAt: new Date(),
                lastLoginIp: ipAddress,
            },
        });
        this.logger.log(`Customer logged in: ${customer.email || customer.phone} from ${ipAddress}`);
        return {
            message: constants_1.SUCCESS_MESSAGES.LOGIN_SUCCESS,
            data: {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: {
                    id: customer.id,
                    email: customer.email,
                    phone: customer.phone,
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                },
            },
        };
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('jwt.secret'),
            });
            const storedTokens = await this.prisma.authToken.findMany({
                where: {
                    userType: payload.userType,
                    revoked: false,
                    expiresAt: { gt: new Date() },
                    ...(payload.userType === client_1.AuthUserType.ADMIN
                        ? { adminId: payload.sub }
                        : { customerId: payload.sub }),
                },
                orderBy: { createdAt: 'desc' },
            });
            let validToken = null;
            for (const token of storedTokens) {
                const isValid = await bcrypt.compare(refreshToken, token.tokenHash);
                if (isValid) {
                    validToken = token;
                    break;
                }
            }
            if (!validToken) {
                throw new common_1.UnauthorizedException(constants_1.ERROR_MESSAGES.TOKEN_INVALID);
            }
            await this.prisma.authToken.update({
                where: { id: validToken.id },
                data: {
                    revoked: true,
                    revokedAt: new Date(),
                },
            });
            const tokens = this.generateTokens({
                sub: payload.sub,
                email: payload.email,
                userType: payload.userType,
                role: payload.role,
                permissions: payload.permissions,
            });
            await this.saveRefreshToken(payload.sub, payload.userType, tokens.refreshToken);
            return {
                message: 'Tokens refreshed successfully',
                data: tokens,
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException(constants_1.ERROR_MESSAGES.TOKEN_INVALID);
        }
    }
    async logout(userId, userType) {
        await this.prisma.authToken.updateMany({
            where: {
                userType,
                revoked: false,
                ...(userType === client_1.AuthUserType.ADMIN
                    ? { adminId: userId }
                    : { customerId: userId }),
            },
            data: { revoked: true, revokedAt: new Date() },
        });
        this.logger.log(`User logged out: ${userId}`);
        return {
            message: constants_1.SUCCESS_MESSAGES.LOGOUT_SUCCESS,
        };
    }
    async logoutAll(userId, userType) {
        await this.prisma.authToken.updateMany({
            where: {
                userType,
                ...(userType === client_1.AuthUserType.ADMIN
                    ? { adminId: userId }
                    : { customerId: userId }),
            },
            data: { revoked: true, revokedAt: new Date() },
        });
        this.logger.log(`All sessions logged out: ${userId}`);
        return {
            message: 'All sessions logged out successfully',
        };
    }
    async changePassword(userId, userType, dto) {
        const user = userType === client_1.AuthUserType.ADMIN
            ? await this.prisma.admin.findUnique({ where: { id: userId } })
            : await this.prisma.customer.findUnique({ where: { id: userId } });
        if (!user || user.isDeleted || !user.isActive) {
            throw new common_1.BadRequestException(constants_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        if (!user.password) {
            throw new common_1.BadRequestException('No password set for this account');
        }
        const isValid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        if (dto.currentPassword === dto.newPassword) {
            throw new common_1.BadRequestException('New password must be different from current password');
        }
        const saltRounds = this.configService.get('security.bcryptRounds') ?? 12;
        const hashedPassword = await bcrypt.hash(dto.newPassword, saltRounds);
        await this.prisma.$transaction(async (tx) => {
            if (userType === client_1.AuthUserType.ADMIN) {
                await tx.admin.update({
                    where: { id: userId },
                    data: { password: hashedPassword },
                });
            }
            else {
                await tx.customer.update({
                    where: { id: userId },
                    data: { password: hashedPassword },
                });
            }
            await tx.authToken.updateMany({
                where: {
                    userType,
                    ...(userType === client_1.AuthUserType.ADMIN
                        ? { adminId: userId }
                        : { customerId: userId }),
                },
                data: { revoked: true, revokedAt: new Date() },
            });
        });
        this.logger.log(`Password changed for ${userType}: ${user.email || user.phone}`);
        return {
            message: constants_1.SUCCESS_MESSAGES.PASSWORD_CHANGED,
        };
    }
    generateTokens(payload) {
        const accessExpiresStr = this.configService.get('jwt.accessExpires') ?? '15m';
        const refreshExpiresStr = this.configService.get('jwt.refreshExpires') ?? '7d';
        const accessExpiresIn = this.parseTimeToSeconds(accessExpiresStr);
        const refreshExpiresIn = this.parseTimeToSeconds(refreshExpiresStr);
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: accessExpiresIn,
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: refreshExpiresIn,
        });
        return { accessToken, refreshToken };
    }
    parseTimeToSeconds(time) {
        const match = time.match(/^(\d+)([smhd])$/);
        if (!match) {
            return 900;
        }
        const value = parseInt(match[1], 10);
        const unit = match[2];
        switch (unit) {
            case 's':
                return value;
            case 'm':
                return value * 60;
            case 'h':
                return value * 60 * 60;
            case 'd':
                return value * 60 * 60 * 24;
            default:
                return 900;
        }
    }
    async saveRefreshToken(userId, userType, refreshToken, ipAddress) {
        const saltRounds = this.configService.get('security.bcryptRounds') ?? 12;
        const tokenHash = await bcrypt.hash(refreshToken, saltRounds);
        const refreshExpiresDays = this.parseTimeToSeconds(this.configService.get('jwt.refreshExpires') ?? '7d') /
            (60 * 60 * 24);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + refreshExpiresDays);
        await this.prisma.authToken.create({
            data: {
                userType,
                tokenHash,
                expiresAt,
                ipAddress,
                ...(userType === client_1.AuthUserType.ADMIN
                    ? { adminId: userId }
                    : { customerId: userId }),
            },
        });
    }
    async revokeAllUserTokens(userId, userType) {
        await this.prisma.authToken.updateMany({
            where: {
                userType,
                ...(userType === client_1.AuthUserType.ADMIN
                    ? { adminId: userId }
                    : { customerId: userId }),
            },
            data: { revoked: true, revokedAt: new Date() },
        });
    }
    async createAuditLog(tx, params) {
        try {
            await tx.auditLog.create({
                data: {
                    actorRole: params.actorRole,
                    actorId: params.actorId,
                    action: params.action,
                    model: params.model,
                    recordId: params.recordId,
                    oldData: params.oldData,
                    newData: params.newData,
                },
            });
        }
        catch (error) {
            this.logger.error('Failed to create audit log', error);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map