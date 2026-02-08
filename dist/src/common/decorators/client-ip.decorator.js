"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientIp = void 0;
const common_1 = require("@nestjs/common");
exports.ClientIp = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const ip = request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        request.headers['x-real-ip'] ||
        request.ip ||
        request.socket.remoteAddress ||
        'unknown';
    return ip;
});
//# sourceMappingURL=client-ip.decorator.js.map