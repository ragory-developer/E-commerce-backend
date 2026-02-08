import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto, CategoryFilterDto, AddCategoryToLevelDto } from './dto';
import type { AuthenticatedUser } from '../common/interfaces';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
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
    addCategoryToLevel(dto: AddCategoryToLevelDto, user: AuthenticatedUser): Promise<{
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
    getLevelStatistics(): Promise<{
        message: string;
        data: {
            level: number;
            count: number;
        }[];
    }>;
    create(createCategoryDto: CreateCategoryDto, user: AuthenticatedUser): Promise<{
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
    getChildren(id: string): Promise<{
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
    getBreadcrumb(id: string): Promise<{
        message: string;
        data: {
            id: string;
            name: string;
            slug: string;
            level: number;
        }[];
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto, user: AuthenticatedUser): Promise<{
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
    remove(id: string, user: AuthenticatedUser): Promise<{
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
    restore(id: string, user: AuthenticatedUser): Promise<{
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
}
