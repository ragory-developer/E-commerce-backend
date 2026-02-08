import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto, CategoryFilterDto, AddCategoryToLevelDto } from './dto';
export declare class CategoryService {
    private prisma;
    private readonly logger;
    private readonly MAX_DEPTH;
    constructor(prisma: PrismaService);
    private generateSlug;
    private generatePath;
    private updateParentLeafStatus;
    private updateCategoryLeafStatus;
    private updateDescendantPaths;
    create(dto: CreateCategoryDto, createdBy: string): Promise<{
        message: string;
        data: {
            parent: {
                id: string;
                name: string;
                slug: string;
                level: number;
            } | null;
        } & {
            path: string;
            image: string | null;
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
            parentId: string | null;
            icon: string | null;
            sortOrder: number;
            level: number;
            isLeaf: boolean;
            updatedBy: string | null;
        };
    }>;
    getCategoriesByLevel(level: number, parentId?: string): Promise<{
        message: string;
        data: {
            childrenCount: number;
            _count: undefined;
            parent: {
                id: string;
                name: string;
                slug: string;
                level: number;
            } | null;
            path: string;
            image: string | null;
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
            parentId: string | null;
            icon: string | null;
            sortOrder: number;
            level: number;
            isLeaf: boolean;
            updatedBy: string | null;
        }[];
        meta: {
            level: number;
            total: number;
        };
    }>;
    addCategoryToLevel(dto: AddCategoryToLevelDto, createdBy: string): Promise<{
        message: string;
        data: {
            parent: {
                id: string;
                name: string;
                slug: string;
                level: number;
            } | null;
        } & {
            path: string;
            image: string | null;
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
            parentId: string | null;
            icon: string | null;
            sortOrder: number;
            level: number;
            isLeaf: boolean;
            updatedBy: string | null;
        };
    }>;
    getTree(): Promise<{
        message: string;
        data: ({
            path: string;
            image: string | null;
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
            parentId: string | null;
            icon: string | null;
            sortOrder: number;
            level: number;
            isLeaf: boolean;
            updatedBy: string | null;
        } & {
            children: ({
                path: string;
                image: string | null;
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
                parentId: string | null;
                icon: string | null;
                sortOrder: number;
                level: number;
                isLeaf: boolean;
                updatedBy: string | null;
            } & any)[];
        })[];
        meta: {
            totalCategories: number;
            rootCount: number;
        };
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: {
            children: {
                id: string;
                name: string;
                slug: string;
                sortOrder: number;
                level: number;
                isLeaf: boolean;
            }[];
            parent: {
                id: string;
                name: string;
                slug: string;
                level: number;
            } | null;
        } & {
            path: string;
            image: string | null;
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
            parentId: string | null;
            icon: string | null;
            sortOrder: number;
            level: number;
            isLeaf: boolean;
            updatedBy: string | null;
        };
    }>;
    findBySlug(slug: string): Promise<{
        message: string;
        data: {
            children: {
                path: string;
                image: string | null;
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
                parentId: string | null;
                icon: string | null;
                sortOrder: number;
                level: number;
                isLeaf: boolean;
                updatedBy: string | null;
            }[];
            parent: {
                id: string;
                name: string;
                slug: string;
            } | null;
        } & {
            path: string;
            image: string | null;
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
            parentId: string | null;
            icon: string | null;
            sortOrder: number;
            level: number;
            isLeaf: boolean;
            updatedBy: string | null;
        };
    }>;
    findAll(filters: CategoryFilterDto): Promise<{
        message: string;
        data: {
            childrenCount: number;
            _count: undefined;
            parent: {
                id: string;
                name: string;
                slug: string;
                level: number;
            } | null;
            path: string;
            image: string | null;
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
            parentId: string | null;
            icon: string | null;
            sortOrder: number;
            level: number;
            isLeaf: boolean;
            updatedBy: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getChildren(categoryId: string): Promise<{
        message: string;
        data: {
            childrenCount: number;
            _count: undefined;
            path: string;
            image: string | null;
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
            parentId: string | null;
            icon: string | null;
            sortOrder: number;
            level: number;
            isLeaf: boolean;
            updatedBy: string | null;
        }[];
        meta: {
            parentId: string;
            parentName: string;
            parentLevel: number;
            total: number;
        };
    }>;
    getBreadcrumb(categoryId: string): Promise<{
        message: string;
        data: {
            id: string;
            name: string;
            slug: string;
            level: number;
        }[];
    }>;
    update(id: string, dto: UpdateCategoryDto, updatedBy: string): Promise<{
        message: string;
        data: {
            path: string;
            image: string | null;
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
            parentId: string | null;
            icon: string | null;
            sortOrder: number;
            level: number;
            isLeaf: boolean;
            updatedBy: string | null;
        };
    }>;
    delete(id: string, deletedBy: string): Promise<{
        message: string;
        data: {
            path: string;
            image: string | null;
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
            parentId: string | null;
            icon: string | null;
            sortOrder: number;
            level: number;
            isLeaf: boolean;
            updatedBy: string | null;
        };
    }>;
    restore(id: string, restoredBy: string): Promise<{
        message: string;
        data: {
            path: string;
            image: string | null;
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
            parentId: string | null;
            icon: string | null;
            sortOrder: number;
            level: number;
            isLeaf: boolean;
            updatedBy: string | null;
        };
    }>;
    getLevelStatistics(): Promise<{
        message: string;
        data: {
            level: number;
            count: number;
        }[];
    }>;
}
