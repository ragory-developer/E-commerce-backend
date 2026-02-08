export declare class CategoryFilterDto {
    parentId?: string;
    level?: number;
    isActive?: boolean;
    includeDeleted?: boolean;
    search?: string;
    page?: number;
    limit?: number;
}
export declare class BreadcrumbItemDto {
    id: string;
    name: string;
    slug: string;
    level: number;
}
export declare class CategoryTreeDto {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    path: string;
    level: number;
    isLeaf: boolean;
    description?: string;
    image?: string;
    icon?: string;
    sortOrder: number;
    isActive: boolean;
    children?: CategoryTreeDto[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class CategoryResponseDto {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    path: string;
    level: number;
    isLeaf: boolean;
    description?: string;
    image?: string;
    icon?: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    childrenCount?: number;
}
