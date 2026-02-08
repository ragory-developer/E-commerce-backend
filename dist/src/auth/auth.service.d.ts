import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthUserType, Permission } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AdminLoginDto, CreateAdminDto, CustomerRegisterDto, CustomerLoginDto, AdminFilterDto, ChangePasswordDto } from './dto';
import type { TokenPair, AuthenticatedUser } from '../common/interfaces';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    adminLogin(dto: AdminLoginDto, ipAddress?: string): Promise<{
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                role: import("@prisma/client").$Enums.Role;
                permissions: import("@prisma/client").$Enums.Permission[];
            };
        };
    }>;
    createAdmin(dto: CreateAdminDto, currentUser: AuthenticatedUser): Promise<{
        message: string;
        data: {
            email: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            role: import("@prisma/client").$Enums.Role;
            permissions: import("@prisma/client").$Enums.Permission[];
            id: string;
            createdAt: Date;
        };
    }>;
    getAllAdmins(currentUser: AuthenticatedUser, filters: AdminFilterDto): Promise<{
        message: string;
        data: {
            email: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            role: import("@prisma/client").$Enums.Role;
            permissions: import("@prisma/client").$Enums.Permission[];
            isActive: boolean;
            id: string;
            lastLoginAt: Date | null;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateAdminPermissions(adminId: string, permissions: Permission[], currentUser: AuthenticatedUser): Promise<{
        message: string;
        data: {
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.Role;
            permissions: import("@prisma/client").$Enums.Permission[];
            id: string;
        };
    }>;
    disableAdmin(adminId: string, currentUser: AuthenticatedUser): Promise<{
        message: string;
        data: {
            email: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            id: string;
        };
    }>;
    enableAdmin(adminId: string, currentUser: AuthenticatedUser): Promise<{
        message: string;
        data: {
            email: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            id: string;
        };
    }>;
    deleteAdmin(adminId: string, currentUser: AuthenticatedUser): Promise<{
        message: string;
        data: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
            isDeleted: boolean;
        };
    }>;
    customerRegister(dto: CustomerRegisterDto, ipAddress?: string): Promise<{
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                email: string | null;
                firstName: string | null;
                lastName: string | null;
                phone: string;
                id: string;
                createdAt: Date;
            };
        };
    }>;
    customerLogin(dto: CustomerLoginDto, ipAddress?: string): Promise<{
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                email: string | null;
                phone: string;
                firstName: string | null;
                lastName: string | null;
            };
        };
    }>;
    refreshTokens(refreshToken: string): Promise<{
        message: string;
        data: TokenPair;
    }>;
    logout(userId: string, userType: AuthUserType): Promise<{
        message: string;
    }>;
    logoutAll(userId: string, userType: AuthUserType): Promise<{
        message: string;
    }>;
    changePassword(userId: string, userType: AuthUserType, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    private generateTokens;
    private parseTimeToSeconds;
    private saveRefreshToken;
    private revokeAllUserTokens;
    private createAuditLog;
}
