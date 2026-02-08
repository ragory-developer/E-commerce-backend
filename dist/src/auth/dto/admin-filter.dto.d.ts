import { Role } from '@prisma/client';
import { PaginationDto } from './pagination.dto';
export declare class AdminFilterDto extends PaginationDto {
    role?: Role;
    search?: string;
    isActive?: boolean;
}
