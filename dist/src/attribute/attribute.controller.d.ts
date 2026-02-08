import { AttributeService } from './attribute.service';
import { CreateAttributeSetDto, CreateAttributeDto, CreateAttributeValueDto } from './dto/attribute.dto';
import type { AuthenticatedUser } from '../common/interfaces';
export declare class AttributeController {
    private readonly attributeService;
    constructor(attributeService: AttributeService);
    createSet(dto: CreateAttributeSetDto, user: AuthenticatedUser): Promise<{
        message: string;
        data: {
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            name: string;
            slug: string;
            sortOrder: number;
            updatedBy: string | null;
        };
    }>;
    getAllSets(): Promise<{
        message: string;
        data: ({
            attributes: ({
                values: {
                    value: string;
                    isActive: boolean;
                    id: string;
                    isDeleted: boolean;
                    deletedAt: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                    createdBy: string | null;
                    sortOrder: number;
                    updatedBy: string | null;
                    attributeId: string;
                }[];
            } & {
                isActive: boolean;
                id: string;
                isDeleted: boolean;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                name: string;
                slug: string;
                sortOrder: number;
                updatedBy: string | null;
                attributeSetId: string;
            })[];
        } & {
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            name: string;
            slug: string;
            sortOrder: number;
            updatedBy: string | null;
        })[];
    }>;
    getSetById(id: string): Promise<{
        message: string;
        data: {
            attributes: ({
                values: {
                    value: string;
                    isActive: boolean;
                    id: string;
                    isDeleted: boolean;
                    deletedAt: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                    createdBy: string | null;
                    sortOrder: number;
                    updatedBy: string | null;
                    attributeId: string;
                }[];
            } & {
                isActive: boolean;
                id: string;
                isDeleted: boolean;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                name: string;
                slug: string;
                sortOrder: number;
                updatedBy: string | null;
                attributeSetId: string;
            })[];
        } & {
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            name: string;
            slug: string;
            sortOrder: number;
            updatedBy: string | null;
        };
    }>;
    getSetBySlug(slug: string): Promise<{
        message: string;
        data: {
            attributes: ({
                values: {
                    value: string;
                    isActive: boolean;
                    id: string;
                    isDeleted: boolean;
                    deletedAt: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                    createdBy: string | null;
                    sortOrder: number;
                    updatedBy: string | null;
                    attributeId: string;
                }[];
            } & {
                isActive: boolean;
                id: string;
                isDeleted: boolean;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                name: string;
                slug: string;
                sortOrder: number;
                updatedBy: string | null;
                attributeSetId: string;
            })[];
        } & {
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            name: string;
            slug: string;
            sortOrder: number;
            updatedBy: string | null;
        };
    }>;
    deleteSet(id: string): Promise<{
        message: string;
        data: {
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            name: string;
            slug: string;
            sortOrder: number;
            updatedBy: string | null;
        };
    }>;
    createAttribute(dto: CreateAttributeDto, user: AuthenticatedUser): Promise<{
        message: string;
        data: {
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            name: string;
            slug: string;
            sortOrder: number;
            updatedBy: string | null;
            attributeSetId: string;
        };
    }>;
    getAttributesBySet(setId: string): Promise<{
        message: string;
        data: ({
            values: {
                value: string;
                isActive: boolean;
                id: string;
                isDeleted: boolean;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                sortOrder: number;
                updatedBy: string | null;
                attributeId: string;
            }[];
        } & {
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            name: string;
            slug: string;
            sortOrder: number;
            updatedBy: string | null;
            attributeSetId: string;
        })[];
    }>;
    getAttributeById(id: string): Promise<{
        message: string;
        data: {
            attributeSet: {
                isActive: boolean;
                id: string;
                isDeleted: boolean;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                name: string;
                slug: string;
                sortOrder: number;
                updatedBy: string | null;
            };
            values: {
                value: string;
                isActive: boolean;
                id: string;
                isDeleted: boolean;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                sortOrder: number;
                updatedBy: string | null;
                attributeId: string;
            }[];
        } & {
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            name: string;
            slug: string;
            sortOrder: number;
            updatedBy: string | null;
            attributeSetId: string;
        };
    }>;
    getAttributeBySlug(setId: string, slug: string): Promise<{
        message: string;
        data: {
            attributeSet: {
                isActive: boolean;
                id: string;
                isDeleted: boolean;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                name: string;
                slug: string;
                sortOrder: number;
                updatedBy: string | null;
            };
            values: {
                value: string;
                isActive: boolean;
                id: string;
                isDeleted: boolean;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                sortOrder: number;
                updatedBy: string | null;
                attributeId: string;
            }[];
        } & {
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            name: string;
            slug: string;
            sortOrder: number;
            updatedBy: string | null;
            attributeSetId: string;
        };
    }>;
    deleteAttribute(id: string): Promise<{
        message: string;
        data: {
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            name: string;
            slug: string;
            sortOrder: number;
            updatedBy: string | null;
            attributeSetId: string;
        };
    }>;
    createValue(dto: CreateAttributeValueDto, user: AuthenticatedUser): Promise<{
        message: string;
        data: {
            value: string;
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            sortOrder: number;
            updatedBy: string | null;
            attributeId: string;
        };
    }>;
    getValuesByAttribute(attributeId: string): Promise<{
        message: string;
        data: {
            value: string;
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            sortOrder: number;
            updatedBy: string | null;
            attributeId: string;
        }[];
    }>;
    deleteValue(id: string): Promise<{
        message: string;
        data: {
            value: string;
            isActive: boolean;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            sortOrder: number;
            updatedBy: string | null;
            attributeId: string;
        };
    }>;
}
