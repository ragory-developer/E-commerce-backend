export declare class CreateAttributeSetDto {
    name: string;
    slug?: string;
    description?: string;
    sortOrder?: number;
}
export declare class CreateAttributeDto {
    name: string;
    slug?: string;
    attributeSetId: string;
    sortOrder?: number;
}
export declare class CreateAttributeValueDto {
    value: string;
    attributeId: string;
    sortOrder?: number;
}
