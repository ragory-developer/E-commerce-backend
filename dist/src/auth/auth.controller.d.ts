import { AuthService } from './auth.service';
import { AdminLoginDto, CreateAdminDto, CustomerRegisterDto, CustomerLoginDto, RefreshTokenDto, UpdatePermissionsDto, ChangePasswordDto, AdminFilterDto } from './dto';
import type { AuthenticatedUser } from '../common/interfaces';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    adminLogin(dto: AdminLoginDto, ipAddress: string): Promise<{
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
    getAllAdmins(filterDto: AdminFilterDto, currentUser: AuthenticatedUser): Promise<{
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
    updateAdminPermissions(adminId: string, dto: UpdatePermissionsDto, currentUser: AuthenticatedUser): Promise<{
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
    customerRegister(dto: CustomerRegisterDto, ipAddress: string): Promise<{
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
    customerLogin(dto: CustomerLoginDto, ipAddress: string): Promise<{
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
    refreshTokens(dto: RefreshTokenDto): Promise<{
        message: string;
        data: import("../common/interfaces").TokenPair;
    }>;
    logout(user: AuthenticatedUser): Promise<{
        message: string;
    }>;
    logoutAll(user: AuthenticatedUser): Promise<{
        message: string;
    }>;
    getProfile(user: AuthenticatedUser): {
        message: string;
        data: AuthenticatedUser;
    };
    changePassword(dto: ChangePasswordDto, user: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
