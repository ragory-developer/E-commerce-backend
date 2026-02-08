"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AttributeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AttributeService = AttributeService_1 = class AttributeService {
    prisma;
    logger = new common_1.Logger(AttributeService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }
    async createSet(dto, createdBy) {
        const slug = dto.slug || this.generateSlug(dto.name);
        const exists = await this.prisma.attributeSet.findUnique({
            where: { slug },
        });
        if (exists) {
            throw new common_1.ConflictException(`Slug "${slug}" already exists`);
        }
        const attributeSet = await this.prisma.attributeSet.create({
            data: {
                name: dto.name,
                slug,
                sortOrder: dto.sortOrder || 0,
                createdBy,
            },
        });
        this.logger.log(`Attribute set created: ${attributeSet.name}`);
        return {
            message: 'Attribute set created successfully',
            data: attributeSet,
        };
    }
    async getAllSets() {
        const attributeSets = await this.prisma.attributeSet.findMany({
            where: { isDeleted: false },
            include: {
                attributes: {
                    where: { isDeleted: false },
                    include: {
                        values: {
                            where: { isDeleted: false },
                            orderBy: { sortOrder: 'asc' },
                        },
                    },
                    orderBy: { sortOrder: 'asc' },
                },
            },
            orderBy: { sortOrder: 'asc' },
        });
        return {
            message: 'Attribute sets retrieved successfully',
            data: attributeSets,
        };
    }
    async getSetById(id) {
        const attributeSet = await this.prisma.attributeSet.findFirst({
            where: { id, isDeleted: false },
            include: {
                attributes: {
                    where: { isDeleted: false },
                    include: {
                        values: {
                            where: { isDeleted: false },
                            orderBy: { sortOrder: 'asc' },
                        },
                    },
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
        if (!attributeSet) {
            throw new common_1.NotFoundException('Attribute set not found');
        }
        return {
            message: 'Attribute set retrieved successfully',
            data: attributeSet,
        };
    }
    async getSetBySlug(slug) {
        const attributeSet = await this.prisma.attributeSet.findFirst({
            where: { slug, isDeleted: false },
            include: {
                attributes: {
                    where: { isDeleted: false },
                    include: {
                        values: {
                            where: { isDeleted: false },
                            orderBy: { sortOrder: 'asc' },
                        },
                    },
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
        if (!attributeSet) {
            throw new common_1.NotFoundException('Attribute set not found');
        }
        return {
            message: 'Attribute set retrieved successfully',
            data: attributeSet,
        };
    }
    async deleteSet(id) {
        const attributeSet = await this.prisma.attributeSet.findFirst({
            where: { id, isDeleted: false },
        });
        if (!attributeSet) {
            throw new common_1.NotFoundException('Attribute set not found');
        }
        const deleted = await this.prisma.attributeSet.update({
            where: { id },
            data: {
                isDeleted: true,
                isActive: false,
                deletedAt: new Date(),
            },
        });
        this.logger.log(`Attribute set deleted: ${deleted.name}`);
        return {
            message: 'Attribute set deleted successfully',
            data: deleted,
        };
    }
    async createAttribute(dto, createdBy) {
        const attributeSet = await this.prisma.attributeSet.findFirst({
            where: { id: dto.attributeSetId, isDeleted: false },
        });
        if (!attributeSet) {
            throw new common_1.BadRequestException('Attribute set not found');
        }
        const slug = dto.slug || this.generateSlug(dto.name);
        const exists = await this.prisma.attribute.findFirst({
            where: {
                slug,
                attributeSetId: dto.attributeSetId,
                isDeleted: false,
            },
        });
        if (exists) {
            throw new common_1.ConflictException(`Slug "${slug}" already exists in this set`);
        }
        const attribute = await this.prisma.attribute.create({
            data: {
                name: dto.name,
                slug,
                attributeSetId: dto.attributeSetId,
                sortOrder: dto.sortOrder || 0,
                createdBy,
            },
        });
        this.logger.log(`Attribute created: ${attribute.name}`);
        return {
            message: 'Attribute created successfully',
            data: attribute,
        };
    }
    async getAttributesBySet(attributeSetId) {
        const attributes = await this.prisma.attribute.findMany({
            where: { attributeSetId, isDeleted: false },
            include: {
                values: {
                    where: { isDeleted: false },
                    orderBy: { sortOrder: 'asc' },
                },
            },
            orderBy: { sortOrder: 'asc' },
        });
        return {
            message: 'Attributes retrieved successfully',
            data: attributes,
        };
    }
    async getAttributeById(id) {
        const attribute = await this.prisma.attribute.findFirst({
            where: { id, isDeleted: false },
            include: {
                values: {
                    where: { isDeleted: false },
                    orderBy: { sortOrder: 'asc' },
                },
                attributeSet: true,
            },
        });
        if (!attribute) {
            throw new common_1.NotFoundException('Attribute not found');
        }
        return {
            message: 'Attribute retrieved successfully',
            data: attribute,
        };
    }
    async getAttributeBySlug(attributeSetId, slug) {
        const attribute = await this.prisma.attribute.findFirst({
            where: { attributeSetId, slug, isDeleted: false },
            include: {
                values: {
                    where: { isDeleted: false },
                    orderBy: { sortOrder: 'asc' },
                },
                attributeSet: true,
            },
        });
        if (!attribute) {
            throw new common_1.NotFoundException('Attribute not found');
        }
        return {
            message: 'Attribute retrieved successfully',
            data: attribute,
        };
    }
    async deleteAttribute(id) {
        const attribute = await this.prisma.attribute.findFirst({
            where: { id, isDeleted: false },
        });
        if (!attribute) {
            throw new common_1.NotFoundException('Attribute not found');
        }
        const deleted = await this.prisma.attribute.update({
            where: { id },
            data: {
                isDeleted: true,
                isActive: false,
                deletedAt: new Date(),
            },
        });
        this.logger.log(`Attribute deleted: ${deleted.name}`);
        return {
            message: 'Attribute deleted successfully',
            data: deleted,
        };
    }
    async createValue(dto, createdBy) {
        const attribute = await this.prisma.attribute.findFirst({
            where: { id: dto.attributeId, isDeleted: false },
        });
        if (!attribute) {
            throw new common_1.BadRequestException('Attribute not found');
        }
        const value = await this.prisma.attributeValue.create({
            data: {
                value: dto.value,
                attributeId: dto.attributeId,
                sortOrder: dto.sortOrder || 0,
                createdBy,
            },
        });
        this.logger.log(`Attribute value created: ${value.value}`);
        return {
            message: 'Attribute value created successfully',
            data: value,
        };
    }
    async getValuesByAttribute(attributeId) {
        const values = await this.prisma.attributeValue.findMany({
            where: { attributeId, isDeleted: false },
            orderBy: { sortOrder: 'asc' },
        });
        return {
            message: 'Attribute values retrieved successfully',
            data: values,
        };
    }
    async getValueById(id) {
        const value = await this.prisma.attributeValue.findFirst({
            where: { id, isDeleted: false },
            include: {
                attribute: {
                    include: {
                        attributeSet: true,
                    },
                },
            },
        });
        if (!value) {
            throw new common_1.NotFoundException('Attribute value not found');
        }
        return {
            message: 'Attribute value retrieved successfully',
            data: value,
        };
    }
    async deleteValue(id) {
        const value = await this.prisma.attributeValue.findFirst({
            where: { id, isDeleted: false },
        });
        if (!value) {
            throw new common_1.NotFoundException('Attribute value not found');
        }
        const deleted = await this.prisma.attributeValue.update({
            where: { id },
            data: {
                isDeleted: true,
                isActive: false,
                deletedAt: new Date(),
            },
        });
        this.logger.log(`Attribute value deleted: ${deleted.value}`);
        return {
            message: 'Attribute value deleted successfully',
            data: deleted,
        };
    }
};
exports.AttributeService = AttributeService;
exports.AttributeService = AttributeService = AttributeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttributeService);
//# sourceMappingURL=attribute.service.js.map