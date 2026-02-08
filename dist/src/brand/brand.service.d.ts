import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto';
export declare class BrandService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private generateSlug;
    create(dto: CreateBrandDto, createdBy: string): Promise<{
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
    update(id: string, dto: UpdateBrandDto, updatedBy: string): Promise<{
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
    delete(id: string, deletedBy: string): Promise<{
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
    restore(id: string, restoredBy: string): Promise<{
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
