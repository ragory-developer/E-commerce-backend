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
var TagService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TagService = TagService_1 = class TagService {
    Prisma;
    Logger = new common_1.Logger(TagService_1.name);
    constructor(Prisma) {
        this.Prisma = Prisma;
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    async create(dto, createdBy) {
        const slug = dto.slug || this.generateSlug(dto.name);
        const existingSlug = await this.Prisma.tag.findUnique({
            where: { slug },
        });
        if (existingSlug) {
            throw new common_1.ConflictException(`Tag with slug "${slug}" already exists`);
        }
        const existingName = await this.Prisma.tag.findUnique({
            where: { name: dto.name },
        });
        if (existingName) {
            throw new common_1.ConflictException(' Tag with name "${dto.name}" already exists');
        }
        const tag = await this.Prisma.tag.create({
            data: {
                name: dto.name,
                slug,
                logo: dto.logo,
                description: dto.description,
                metaTitle: dto.metaTitle,
                metaDescription: dto.metaDescription,
                createdBy,
            },
        });
        this.Logger.log(`Tag created: ${tag.name}`);
        return {
            message: 'Tag create successfully',
            data: tag,
        };
    }
    async findAll() {
        const tags = await this.Prisma.tag.findMany({
            where: { isDeleted: false },
            orderBy: { name: 'asc' },
        });
        return {
            message: 'Brands retrieved successfully',
            data: tags,
        };
    }
    async findById(id) {
        const tag = await this.Prisma.tag.findFirst({
            where: { id, isDeleted: false },
        });
        if (!tag) {
            throw new common_1.NotFoundException(' Tag not found');
        }
        return {
            message: 'tag retrieved successfully',
            data: tag,
        };
    }
    async findBySlug(slug) {
        const tag = await this.Prisma.tag.findFirst({
            where: { slug, isDeleted: false },
        });
        if (!tag) {
            throw new common_1.NotFoundException('Tag not found');
        }
        return {
            message: 'tag retrieved successfully',
            data: tag,
        };
    }
    async update(id, dto, updatedBy) {
        const tag = await this.Prisma.tag.findFirst({
            where: { id, isDeleted: false },
        });
        if (!tag) {
            throw new common_1.NotFoundException('tag is not found');
        }
        if (dto.slug && dto.slug == tag.slug) {
            const existingSlug = await this.Prisma.tag.findFirst({
                where: { slug: dto.slug, id: { not: id } },
            });
            if (existingSlug) {
                throw new common_1.ConflictException(` tag with slug "${dto.slug}" already exists `);
            }
        }
        if (dto.name && dto.name !== tag.name) {
            const existingName = await this.Prisma.tag.findFirst({
                where: { name: dto.name, id: { not: id } },
            });
            if (existingName) {
                throw new common_1.ConflictException(`Brand with name "${dto.name}" already exists`);
            }
        }
        const updated = await this.Prisma.tag.update({
            where: { id },
            data: {
                ...dto,
                slug: dto.slug || (dto.name ? this.generateSlug(dto.name) : undefined),
                updatedBy,
            },
        });
        this.Logger.log(`Brand updated: ${updated.name}`);
        return {
            message: 'Brand updated successfully',
            data: updated,
        };
    }
    async delete(id, deletedBy) {
        const brand = await this.Prisma.brand.findFirst({
            where: { id, isDeleted: false },
        });
        if (!brand) {
            throw new common_1.NotFoundException('Brand not found');
        }
        const deleted = await this.Prisma.brand.update({
            where: { id },
            data: {
                isDeleted: true,
                isActive: false,
                deletedAt: new Date(),
                updatedBy: deletedBy,
            },
        });
        this.Logger.log(`Brand deleted: ${deleted.name}`);
        return {
            message: 'Brand deleted successfully',
            data: deleted,
        };
    }
    async restore(id, restoredBy) {
        const brand = await this.Prisma.brand.findFirst({
            where: { id, isDeleted: true },
        });
        if (!brand) {
            throw new common_1.NotFoundException('Deleted brand not found');
        }
        const restored = await this.Prisma.brand.update({
            where: { id },
            data: {
                isDeleted: false,
                isActive: true,
                deletedAt: null,
                updatedBy: restoredBy,
            },
        });
        this.Logger.log(`Brand restored: ${restored.name}`);
        return {
            message: 'Brand restored successfully',
            data: restored,
        };
    }
};
exports.TagService = TagService;
exports.TagService = TagService = TagService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TagService);
//# sourceMappingURL=tag.service.js.map