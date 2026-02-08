export declare class CreateBrandDto {
    name: string;
    slug?: string;
    logo?: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
}
export declare class UpdateBrandDto {
    name?: string;
    slug?: string;
    logo?: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
    isActive?: boolean;
}
