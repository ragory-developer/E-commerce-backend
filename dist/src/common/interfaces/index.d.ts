import { AuthUserType, Permission, Role } from '@prisma/client';
export interface JwtPayload {
    sub: string;
    email: string;
    userType: AuthUserType;
    role?: Role;
    permissions?: Permission[];
}
export interface AuthenticatedUser {
    id: string;
    email: string;
    userType: AuthUserType;
    role?: Role;
    permissions?: Permission[];
}
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    timestamp: string;
}
