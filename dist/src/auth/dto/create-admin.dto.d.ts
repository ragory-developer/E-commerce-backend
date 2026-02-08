import { Role, Permission } from '@prisma/client';
export declare class CreateAdminDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role?: Role;
    permissions?: Permission[];
}
