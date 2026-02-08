import { CreateBrandDto } from 'src/brand/dto/brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTagDto } from './dto/tag.dto';
export declare class TagService {
    private Prisma;
    private readonly Logger;
    constructor(Prisma: PrismaService);
    private generateSlug;
    create(dto: CreateBrandDto, createdBy: string): Promise<{
        message: string;
        data: {
            description: string | null;
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            name: string;
            slug: string;
            updatedBy: string | null;
            logo: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
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
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            name: string;
            slug: string;
            updatedBy: string | null;
            logo: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
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
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            name: string;
            slug: string;
            updatedBy: string | null;
            logo: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
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
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            name: string;
            slug: string;
            updatedBy: string | null;
            logo: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
        };
    }>;
    update(id: string, dto: UpdateTagDto, updatedBy: string): Promise<{
        message: string;
        data: {
            description: string | null;
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            name: string;
            slug: string;
            updatedBy: string | null;
            logo: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
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
