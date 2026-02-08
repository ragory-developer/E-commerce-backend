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
var BrandService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BrandService = BrandService_1 = class BrandService {
    prisma;
    logger = new common_1.Logger(BrandService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
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
        const existingSlug = await this.prisma.brand.findUnique({
            where: { slug },
        });
        if (existingSlug) {
            throw new common_1.ConflictException(`Brand with slug "${slug}" already exists`);
        }
        const existingName = await this.prisma.brand.findUnique({
            where: { name: dto.name },
        });
        if (existingName) {
            throw new common_1.ConflictException(`Brand with name "${dto.name}" already exists`);
        }
        const brand = await this.prisma.brand.create({
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
        this.logger.log(`Brand created: ${brand.name}`);
        return {
            message: 'Brand created successfully',
            data: brand,
        };
    }
    async findAll() {
        const brands = await this.prisma.brand.findMany({
            where: { isDeleted: false },
            orderBy: { name: 'asc' },
        });
        return {
            message: 'Brands retrieved successfully',
            data: brands,
        };
    }
    async findById(id) {
        const brand = await this.prisma.brand.findFirst({
            where: { id, isDeleted: false },
        });
        if (!brand) {
            throw new common_1.NotFoundException('Brand not found');
        }
        return {
            message: 'Brand retrieved successfully',
            data: brand,
        };
    }
    async findBySlug(slug) {
        const brand = await this.prisma.brand.findFirst({
            where: { slug, isDeleted: false },
        });
        if (!brand) {
            throw new common_1.NotFoundException('Brand not found');
        }
        return {
            message: 'Brand retrieved successfully',
            data: brand,
        };
    }
    async update(id, dto, updatedBy) {
        const brand = await this.prisma.brand.findFirst({
            where: { id, isDeleted: false },
        });
        if (!brand) {
            throw new common_1.NotFoundException('Brand not found');
        }
        if (dto.slug && dto.slug !== brand.slug) {
            const existingSlug = await this.prisma.brand.findFirst({
                where: { slug: dto.slug, id: { not: id } },
            });
            if (existingSlug) {
                throw new common_1.ConflictException(`Brand with slug "${dto.slug}" already exists`);
            }
        }
        if (dto.name && dto.name !== brand.name) {
            const existingName = await this.prisma.brand.findFirst({
                where: { name: dto.name, id: { not: id } },
            });
            if (existingName) {
                throw new common_1.ConflictException(`Brand with name "${dto.name}" already exists`);
            }
        }
        const updated = await this.prisma.brand.update({
            where: { id },
            data: {
                ...dto,
                slug: dto.slug || (dto.name ? this.generateSlug(dto.name) : undefined),
                updatedBy,
            },
        });
        this.logger.log(`Brand updated: ${updated.name}`);
        return {
            message: 'Brand updated successfully',
            data: updated,
        };
    }
    async delete(id, deletedBy) {
        const brand = await this.prisma.brand.findFirst({
            where: { id, isDeleted: false },
        });
        if (!brand) {
            throw new common_1.NotFoundException('Brand not found');
        }
        const deleted = await this.prisma.brand.update({
            where: { id },
            data: {
                isDeleted: true,
                isActive: false,
                deletedAt: new Date(),
                updatedBy: deletedBy,
            },
        });
        this.logger.log(`Brand deleted: ${deleted.name}`);
        return {
            message: 'Brand deleted successfully',
            data: deleted,
        };
    }
    async restore(id, restoredBy) {
        const brand = await this.prisma.brand.findFirst({
            where: { id, isDeleted: true },
        });
        if (!brand) {
            throw new common_1.NotFoundException('Deleted brand not found');
        }
        const restored = await this.prisma.brand.update({
            where: { id },
            data: {
                isDeleted: false,
                isActive: true,
                deletedAt: null,
                updatedBy: restoredBy,
            },
        });
        this.logger.log(`Brand restored: ${restored.name}`);
        return {
            message: 'Brand restored successfully',
            data: restored,
        };
    }
};
exports.BrandService = BrandService;
exports.BrandService = BrandService = BrandService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BrandService);
//# sourceMappingURL=brand.service.js.map