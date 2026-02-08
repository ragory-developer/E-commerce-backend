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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const attribute_service_1 = require("./attribute.service");
const attribute_dto_1 = require("./dto/attribute.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
let AttributeController = class AttributeController {
    attributeService;
    constructor(attributeService) {
        this.attributeService = attributeService;
    }
    createSet(dto, user) {
        return this.attributeService.createSet(dto, user.id);
    }
    getAllSets() {
        return this.attributeService.getAllSets();
    }
    getSetById(id) {
        return this.attributeService.getSetById(id);
    }
    getSetBySlug(slug) {
        return this.attributeService.getSetBySlug(slug);
    }
    deleteSet(id) {
        return this.attributeService.deleteSet(id);
    }
    createAttribute(dto, user) {
        return this.attributeService.createAttribute(dto, user.id);
    }
    getAttributesBySet(setId) {
        return this.attributeService.getAttributesBySet(setId);
    }
    getAttributeById(id) {
        return this.attributeService.getAttributeById(id);
    }
    getAttributeBySlug(setId, slug) {
        return this.attributeService.getAttributeBySlug(setId, slug);
    }
    deleteAttribute(id) {
        return this.attributeService.deleteAttribute(id);
    }
    createValue(dto, user) {
        return this.attributeService.createValue(dto, user.id);
    }
    getValuesByAttribute(attributeId) {
        return this.attributeService.getValuesByAttribute(attributeId);
    }
    deleteValue(id) {
        return this.attributeService.deleteValue(id);
    }
};
exports.AttributeController = AttributeController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create Attribute Set' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Attribute set created' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Post)('sets'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attribute_dto_1.CreateAttributeSetDto, Object]),
    __metadata("design:returntype", void 0)
], AttributeController.prototype, "createSet", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get All Attribute Sets (with nested attributes & values)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attribute sets retrieved' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)('sets'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AttributeController.prototype, "getAllSets", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Attribute Set by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Attribute set ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attribute set retrieved' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)('sets/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttributeController.prototype, "getSetById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Attribute Set by Slug' }),
    (0, swagger_1.ApiParam)({
        name: 'slug',
        description: 'Attribute set slug',
        example: 'specifications',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attribute set retrieved' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)('sets/slug/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttributeController.prototype, "getSetBySlug", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete Attribute Set' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Attribute set ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attribute set deleted' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Delete)('sets/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttributeController.prototype, "deleteSet", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create Attribute' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Attribute created' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attribute_dto_1.CreateAttributeDto, Object]),
    __metadata("design:returntype", void 0)
], AttributeController.prototype, "createAttribute", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Attributes by Set ID (with values)' }),
    (0, swagger_1.ApiParam)({ name: 'setId', description: 'Attribute set ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attributes retrieved' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)('by-set/:setId'),
    __param(0, (0, common_1.Param)('setId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttributeController.prototype, "getAttributesBySet", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Attribute by ID (with values)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Attribute ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attribute retrieved' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttributeController.prototype, "getAttributeById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Attribute by Slug' }),
    (0, swagger_1.ApiParam)({ name: 'setId', description: 'Attribute set ID' }),
    (0, swagger_1.ApiParam)({ name: 'slug', description: 'Attribute slug', example: 'ram' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attribute retrieved' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)('by-slug/:setId/:slug'),
    __param(0, (0, common_1.Param)('setId')),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AttributeController.prototype, "getAttributeBySlug", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete Attribute' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Attribute ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attribute deleted' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttributeController.prototype, "deleteAttribute", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create Attribute Value' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Attribute value created' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Post)('values'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attribute_dto_1.CreateAttributeValueDto, Object]),
    __metadata("design:returntype", void 0)
], AttributeController.prototype, "createValue", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Values by Attribute ID' }),
    (0, swagger_1.ApiParam)({ name: 'attributeId', description: 'Attribute ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attribute values retrieved' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.VIEW_PRODUCTS),
    (0, common_1.Get)('values/by-attribute/:attributeId'),
    __param(0, (0, common_1.Param)('attributeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttributeController.prototype, "getValuesByAttribute", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete Attribute Value' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Attribute value ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attribute value deleted' }),
    (0, permissions_decorator_1.Permissions)(client_1.Permission.MANAGE_PRODUCTS),
    (0, common_1.Delete)('values/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttributeController.prototype, "deleteValue", null);
exports.AttributeController = AttributeController = __decorate([
    (0, swagger_1.ApiTags)('Attributes'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('attributes'),
    __metadata("design:paramtypes", [attribute_service_1.AttributeService])
], AttributeController);
//# sourceMappingURL=attribute.controller.js.map