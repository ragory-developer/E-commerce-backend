"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLES_KEY = exports.Permissions = exports.PERMISSIONS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PERMISSIONS_KEY = 'permissions';
const Permissions = (...permissions) => (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, permissions);
exports.Permissions = Permissions;
var roles_decorator_1 = require("./roles.decorator");
Object.defineProperty(exports, "ROLES_KEY", { enumerable: true, get: function () { return roles_decorator_1.ROLES_KEY; } });
//# sourceMappingURL=permissions.decorator.js.map