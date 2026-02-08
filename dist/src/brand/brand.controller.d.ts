import { BrandService } from './brand.service';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto';
import type { AuthenticatedUser } from '../common/interfaces';
export declare class BrandController {
    private readonly brandService;
    constructor(brandService: BrandService);
    create(dto: CreateBrandDto, user: AuthenticatedUser): Promise<{
        message: string;
        data: {
            description: string | null;
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdBy: string | null;
            name: string;
            slug: string;
            updatedBy: string | null;
            logo: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            createAt: Date;
            updateAt: Date;
        };
    }>;
    findAll(): Promise<{
        message: string;
        data: {
            description: string | null;
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdBy: string | null;
            name: string;
            slug: string;
            updatedBy: string | null;
            logo: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            createAt: Date;
            updateAt: Date;
        }[];
    }>;
    findById(id: string): Promise<{
        message: string;
        data: {
            description: string | null;
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdBy: string | null;
            name: string;
            slug: string;
            updatedBy: string | null;
            logo: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            createAt: Date;
            updateAt: Date;
        };
    }>;
    findBySlug(slug: string): Promise<{
        message: string;
        data: {
            description: string | null;
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdBy: string | null;
            name: string;
            slug: string;
            updatedBy: string | null;
            logo: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            createAt: Date;
            updateAt: Date;
        };
    }>;
    update(id: string, dto: UpdateBrandDto, user: AuthenticatedUser): Promise<{
        message: string;
        data: {
            description: string | null;
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdBy: string | null;
            name: string;
            slug: string;
            updatedBy: string | null;
            logo: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            createAt: Date;
            updateAt: Date;
        };
    }>;
    delete(id: string, user: AuthenticatedUser): Promise<{
        message: string;
        data: {
            description: string | null;
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdBy: string | null;
            name: string;
            slug: string;
            updatedBy: string | null;
            logo: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            createAt: Date;
            updateAt: Date;
        };
    }>;
    restore(id: string, user: AuthenticatedUser): Promise<{
        message: string;
        data: {
            description: string | null;
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdBy: string | null;
            name: string;
            slug: string;
            updatedBy: string | null;
            logo: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            createAt: Date;
            updateAt: Date;
        };
    }>;
}
