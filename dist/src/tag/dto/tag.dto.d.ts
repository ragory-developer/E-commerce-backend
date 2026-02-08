export declare class CreateTagDto {
    name: string;
    slug?: string;
    logo?: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
}
export declare class UpdateTagDto {
    name?: string;
    slug?: string;
    logo?: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
    isActive?: boolean;
}
