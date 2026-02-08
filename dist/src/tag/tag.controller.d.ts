import { TagService } from './tag.service';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';
import type { AuthenticatedUser } from '../common/interfaces';
export declare class TagController {
    private readonly TagService;
    constructor(TagService: TagService);
    create(dto: CreateTagDto, user: AuthenticatedUser): Promise<{
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
    update(id: string, dto: UpdateTagDto, user: AuthenticatedUser): Promise<{
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
