import { Role, Permission } from '@prisma/client';
export declare class UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role?: Role;
    permissions?: Permission[];
}
export declare class TokenDataDto {
    accessToken: string;
    refreshToken: string;
    user: UserResponseDto;
}
export declare class LoginResponseDto {
    message: string;
    data: TokenDataDto;
}
export declare class AdminResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: Role;
    permissions: Permission[];
    isActive: boolean;
    createdAt: Date;
    lastLoginAt?: Date;
}
export declare class AdminCreatedResponseDto {
    message: string;
    data: AdminResponseDto;
}
export declare class AdminListMetaDto {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class AdminListResponseDto {
    message: string;
    data: AdminResponseDto[];
    meta: AdminListMetaDto;
}
export declare class MessageResponseDto {
    message: string;
}
export declare class AdminUpdatedResponseDto {
    message: string;
    data: AdminResponseDto;
}
export declare class ProfileResponseDto {
    message: string;
    data: UserResponseDto;
}
export declare class ErrorResponseDto {
    statusCode: number;
    message: string;
    error: string;
}
export declare class ValidationErrorResponseDto {
    statusCode: number;
    message: string[];
    error: string;
}
