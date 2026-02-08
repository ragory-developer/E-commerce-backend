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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const constants_1 = require("../../common/constants");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    prisma;
    constructor(configService, prisma) {
        const secret = configService.get('jwt.secret');
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
        this.prisma = prisma;
    }
    async validate(payload) {
        const { sub: userId, userType } = payload;
        if (userType === client_1.AuthUserType.ADMIN) {
            const admin = await this.prisma.admin.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    permissions: true,
                    isActive: true,
                    isDeleted: true,
                },
            });
            if (!admin || admin.isDeleted || !admin.isActive) {
                throw new common_1.UnauthorizedException(constants_1.ERROR_MESSAGES.USER_INACTIVE);
            }
            return {
                id: admin.id,
                email: admin.email,
                userType: client_1.AuthUserType.ADMIN,
                role: admin.role,
                permissions: admin.permissions,
            };
        }
        if (userType === client_1.AuthUserType.CUSTOMER) {
            const customer = await this.prisma.customer.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    phone: true,
                    isActive: true,
                    isDeleted: true,
                },
            });
            if (!customer || customer.isDeleted || !customer.isActive) {
                throw new common_1.UnauthorizedException(constants_1.ERROR_MESSAGES.USER_INACTIVE);
            }
            return {
                id: customer.id,
                email: customer.email || customer.phone,
                userType: client_1.AuthUserType.CUSTOMER,
            };
        }
        throw new common_1.UnauthorizedException(constants_1.ERROR_MESSAGES.UNAUTHORIZED);
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map