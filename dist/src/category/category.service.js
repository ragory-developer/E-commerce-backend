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
var CategoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoryService = CategoryService_1 = class CategoryService {
    prisma;
    logger = new common_1.Logger(CategoryService_1.name);
    MAX_DEPTH = 10;
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateSlug(name, parentSlug) {
        const baseSlug = name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
        return parentSlug ? `${parentSlug}-${baseSlug}` : baseSlug;
    }
    async generatePath(parentId, slug) {
        if (!parentId) {
            return {
                path: `/${slug}`,
                level: 0,
            };
        }
        const parent = await this.prisma.category.findUnique({
            where: { id: parentId, isDeleted: false },
            select: { path: true, level: true, slug: true },
        });
        if (!parent) {
            throw new common_1.BadRequestException('Parent category not found');
        }
        if (parent.level >= this.MAX_DEPTH) {
            throw new common_1.BadRequestException(`Maximum nesting depth (${this.MAX_DEPTH}) reached`);
        }
        return {
            path: `${parent.path}/${slug}`,
            level: parent.level + 1,
        };
    }
    async updateParentLeafStatus(parentId) {
        await this.prisma.category.update({
            where: { id: parentId },
            data: { isLeaf: false },
        });
    }
    async updateCategoryLeafStatus(categoryId) {
        const childCount = await this.prisma.category.count({
            where: {
                parentId: categoryId,
                isDeleted: false,
            },
        });
        await this.prisma.category.update({
            where: { id: categoryId },
            data: { isLeaf: childCount === 0 },
        });
    }
    async updateDescendantPaths(categoryId, oldPath, newPath) {
        const descendants = await this.prisma.category.findMany({
            where: {
                path: { startsWith: oldPath + '/' },
                isDeleted: false,
            },
            orderBy: { level: 'asc' },
        });
        for (const descendant of descendants) {
            const updatedPath = descendant.path.replace(oldPath, newPath);
            const level = updatedPath.split('/').length - 1;
            await this.prisma.category.update({
                where: { id: descendant.id },
                data: {
                    path: updatedPath,
                    level,
                },
            });
        }
        if (descendants.length > 0) {
            this.logger.log(`Updated ${descendants.length} descendant paths from ${oldPath} to ${newPath}`);
        }
    }
    async create(dto, createdBy) {
        let parentSlug;
        if (dto.parentId) {
            const parent = await this.prisma.category.findUnique({
                where: { id: dto.parentId },
                select: { slug: true },
            });
            parentSlug = parent?.slug;
        }
        const slug = dto.slug || this.generateSlug(dto.name, parentSlug);
        const existingSlug = await this.prisma.category.findUnique({
            where: { slug },
        });
        if (existingSlug) {
            throw new common_1.ConflictException(`Category with slug "${slug}" already exists`);
        }
        const { path, level } = await this.generatePath(dto.parentId, slug);
        const category = await this.prisma.$transaction(async (tx) => {
            const created = await tx.category.create({
                data: {
                    name: dto.name,
                    slug,
                    parentId: dto.parentId || null,
                    path,
                    level,
                    description: dto.description,
                    image: dto.image,
                    icon: dto.icon,
                    sortOrder: dto.sortOrder ?? 0,
                    isLeaf: true,
                    createdBy,
                },
                include: {
                    parent: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            level: true,
                        },
                    },
                },
            });
            if (dto.parentId) {
                await this.updateParentLeafStatus(dto.parentId);
            }
            return created;
        });
        this.logger.log(`Category created: ${category.name} (Level ${category.level}, Path: ${category.path})`);
        return {
            message: 'Category created successfully',
            data: category,
        };
    }
    async getCategoriesByLevel(level, parentId) {
        if (level < 0 || level > this.MAX_DEPTH) {
            throw new common_1.BadRequestException(`Level must be between 0 and ${this.MAX_DEPTH}`);
        }
        const where = {
            level,
            isDeleted: false,
            isActive: true,
        };
        if (parentId !== undefined) {
            if (parentId === 'null' || parentId === null) {
                where.parentId = null;
            }
            else {
                where.parentId = parentId;
            }
        }
        const categories = await this.prisma.category.findMany({
            where,
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
            include: {
                parent: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        level: true,
                    },
                },
                _count: {
                    select: {
                        children: {
                            where: {
                                isDeleted: false,
                            },
                        },
                    },
                },
            },
        });
        return {
            message: `Categories at level ${level} retrieved successfully`,
            data: categories.map((cat) => ({
                ...cat,
                childrenCount: cat._count.children,
                _count: undefined,
            })),
            meta: {
                level,
                total: categories.length,
            },
        };
    }
    async addCategoryToLevel(dto, createdBy) {
        const { level, name, parentId, description, image, icon, sortOrder } = dto;
        if (level < 0 || level > this.MAX_DEPTH) {
            throw new common_1.BadRequestException(`Level must be between 0 and ${this.MAX_DEPTH}`);
        }
        if (level === 0 && parentId) {
            throw new common_1.BadRequestException('Level 0 categories cannot have a parent');
        }
        if (level > 0 && !parentId) {
            throw new common_1.BadRequestException(`Level ${level} categories must have a parent from level ${level - 1}`);
        }
        if (parentId) {
            const parent = await this.prisma.category.findFirst({
                where: {
                    id: parentId,
                    isDeleted: false,
                },
                select: { level: true, slug: true, name: true },
            });
            if (!parent) {
                throw new common_1.BadRequestException('Parent category not found');
            }
            if (parent.level !== level - 1) {
                throw new common_1.BadRequestException(`Parent must be at level ${level - 1}. Selected parent "${parent.name}" is at level ${parent.level}`);
            }
        }
        const createDto = {
            name,
            parentId,
            description,
            image,
            icon,
            sortOrder,
        };
        return this.create(createDto, createdBy);
    }
    async getTree() {
        const allCategories = await this.prisma.category.findMany({
            where: { isDeleted: false, isActive: true },
            orderBy: [{ level: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
        });
        const categoryMap = new Map();
        const rootCategories = [];
        for (const category of allCategories) {
            categoryMap.set(category.id, { ...category, children: [] });
        }
        for (const category of allCategories) {
            const node = categoryMap.get(category.id);
            if (category.parentId === null) {
                rootCategories.push(node);
            }
            else {
                const parent = categoryMap.get(category.parentId);
                if (parent) {
                    parent.children.push(node);
                }
            }
        }
        return {
            message: 'Category tree retrieved successfully',
            data: rootCategories,
            meta: {
                totalCategories: allCategories.length,
                rootCount: rootCategories.length,
            },
        };
    }
    async findOne(id) {
        const category = await this.prisma.category.findFirst({
            where: { id, isDeleted: false },
            include: {
                parent: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        level: true,
                    },
                },
                children: {
                    where: {
                        isDeleted: false,
                        isActive: true,
                    },
                    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        level: true,
                        isLeaf: true,
                        sortOrder: true,
                    },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return {
            message: 'Category retrieved successfully',
            data: category,
        };
    }
    async findBySlug(slug) {
        const category = await this.prisma.category.findFirst({
            where: { slug, isDeleted: false },
            include: {
                parent: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                children: {
                    where: {
                        isDeleted: false,
                        isActive: true,
                    },
                    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return {
            message: 'Category retrieved successfully',
            data: category,
        };
    }
    async findAll(filters) {
        const { parentId, level, isActive, includeDeleted = false, search, page = 1, limit = 20, } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (!includeDeleted) {
            where.isDeleted = false;
        }
        if (parentId !== undefined) {
            where.parentId = parentId === 'null' ? null : parentId;
        }
        if (level !== undefined) {
            where.level = level;
        }
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [categories, total] = await Promise.all([
            this.prisma.category.findMany({
                where,
                include: {
                    parent: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            level: true,
                        },
                    },
                    _count: {
                        select: {
                            children: {
                                where: {
                                    isDeleted: false,
                                },
                            },
                        },
                    },
                },
                orderBy: [{ level: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
                skip,
                take: limit,
            }),
            this.prisma.category.count({ where }),
        ]);
        return {
            message: 'Categories retrieved successfully',
            data: categories.map((cat) => ({
                ...cat,
                childrenCount: cat._count.children,
                _count: undefined,
            })),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getChildren(categoryId) {
        const parent = await this.prisma.category.findFirst({
            where: { id: categoryId, isDeleted: false },
        });
        if (!parent) {
            throw new common_1.NotFoundException('Category not found');
        }
        const children = await this.prisma.category.findMany({
            where: {
                parentId: categoryId,
                isDeleted: false,
                isActive: true,
            },
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
            include: {
                _count: {
                    select: {
                        children: {
                            where: {
                                isDeleted: false,
                            },
                        },
                    },
                },
            },
        });
        return {
            message: 'Children retrieved successfully',
            data: children.map((cat) => ({
                ...cat,
                childrenCount: cat._count.children,
                _count: undefined,
            })),
            meta: {
                parentId: categoryId,
                parentName: parent.name,
                parentLevel: parent.level,
                total: children.length,
            },
        };
    }
    async getBreadcrumb(categoryId) {
        const category = await this.prisma.category.findFirst({
            where: { id: categoryId, isDeleted: false },
            select: { path: true },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const slugs = category.path.split('/').filter(Boolean);
        const breadcrumb = [];
        let currentPath = '';
        for (const slug of slugs) {
            currentPath += `/${slug}`;
            const cat = await this.prisma.category.findFirst({
                where: { path: currentPath, isDeleted: false },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    level: true,
                },
            });
            if (cat) {
                breadcrumb.push(cat);
            }
        }
        return {
            message: 'Breadcrumb retrieved successfully',
            data: breadcrumb,
        };
    }
    async update(id, dto, updatedBy) {
        const category = await this.prisma.category.findFirst({
            where: { id, isDeleted: false },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (dto.slug && dto.slug !== category.slug) {
            const existingSlug = await this.prisma.category.findFirst({
                where: { slug: dto.slug, id: { not: id } },
            });
            if (existingSlug) {
                throw new common_1.ConflictException(`Category with slug "${dto.slug}" already exists`);
            }
        }
        if (dto.parentId && dto.parentId !== category.parentId) {
            const newParent = await this.prisma.category.findUnique({
                where: { id: dto.parentId },
                select: { path: true, level: true },
            });
            if (!newParent) {
                throw new common_1.BadRequestException('New parent category not found');
            }
            if (newParent.path.startsWith(category.path + '/')) {
                throw new common_1.BadRequestException('Cannot move category to its own descendant');
            }
        }
        const updated = await this.prisma.$transaction(async (tx) => {
            let updateData = {
                ...dto,
                updatedBy,
            };
            const needsPathUpdate = dto.name !== undefined ||
                dto.slug !== undefined ||
                (dto.parentId !== undefined && dto.parentId !== category.parentId);
            if (needsPathUpdate) {
                const newSlug = dto.slug ||
                    (dto.name ? this.generateSlug(dto.name) : category.slug);
                const { path, level } = await this.generatePath(dto.parentId !== undefined ? dto.parentId : category.parentId, newSlug);
                updateData = {
                    ...updateData,
                    slug: newSlug,
                    path,
                    level,
                };
                await this.updateDescendantPaths(id, category.path, path);
            }
            const result = await tx.category.update({
                where: { id },
                data: updateData,
            });
            if (dto.parentId !== undefined && dto.parentId !== category.parentId) {
                if (category.parentId) {
                    await this.updateCategoryLeafStatus(category.parentId);
                }
                if (dto.parentId) {
                    await this.updateParentLeafStatus(dto.parentId);
                }
            }
            return result;
        });
        this.logger.log(`Category updated: ${updated.name} (${updated.path})`);
        return {
            message: 'Category updated successfully',
            data: updated,
        };
    }
    async delete(id, deletedBy) {
        const category = await this.prisma.category.findFirst({
            where: { id, isDeleted: false },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const childrenCount = await this.prisma.category.count({
            where: {
                parentId: id,
                isDeleted: false,
            },
        });
        if (childrenCount > 0) {
            throw new common_1.BadRequestException('Cannot delete category with active children. Delete children first.');
        }
        const deleted = await this.prisma.$transaction(async (tx) => {
            const result = await tx.category.update({
                where: { id },
                data: {
                    isDeleted: true,
                    isActive: false,
                    deletedAt: new Date(),
                    updatedBy: deletedBy,
                },
            });
            if (category.parentId) {
                await this.updateCategoryLeafStatus(category.parentId);
            }
            return result;
        });
        this.logger.log(`Category deleted: ${deleted.name}`);
        return {
            message: 'Category deleted successfully',
            data: deleted,
        };
    }
    async restore(id, restoredBy) {
        const category = await this.prisma.category.findFirst({
            where: { id, isDeleted: true },
        });
        if (!category) {
            throw new common_1.NotFoundException('Deleted category not found');
        }
        if (category.parentId) {
            const parent = await this.prisma.category.findFirst({
                where: {
                    id: category.parentId,
                    isDeleted: false,
                    isActive: true,
                },
            });
            if (!parent) {
                throw new common_1.BadRequestException('Cannot restore: parent category is deleted or inactive');
            }
        }
        const restored = await this.prisma.$transaction(async (tx) => {
            const result = await tx.category.update({
                where: { id },
                data: {
                    isDeleted: false,
                    isActive: true,
                    deletedAt: null,
                    updatedBy: restoredBy,
                },
            });
            if (category.parentId) {
                await this.updateParentLeafStatus(category.parentId);
            }
            return result;
        });
        this.logger.log(`Category restored: ${restored.name}`);
        return {
            message: 'Category restored successfully',
            data: restored,
        };
    }
    async getLevelStatistics() {
        const stats = await this.prisma.category.groupBy({
            by: ['level'],
            where: {
                isDeleted: false,
            },
            _count: {
                id: true,
            },
            orderBy: {
                level: 'asc',
            },
        });
        return {
            message: 'Level statistics retrieved successfully',
            data: stats.map((stat) => ({
                level: stat.level,
                count: stat._count.id,
            })),
        };
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = CategoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoryService);
//# sourceMappingURL=category.service.js.map