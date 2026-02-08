"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('port') ?? 3001;
    const nodeEnv = configService.get('nodeEnv') ?? 'development';
    const logger = new common_1.Logger('Bootstrap');
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: nodeEnv === 'production' ? ['https://yourfrontend.com'] : true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        disableErrorMessages: false,
    }));
    const enableSwagger = nodeEnv === 'production' || process.env.ENABLE_SWAGGER === 'true';
    if (enableSwagger) {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle('E-commerce API')
            .setDescription('Authentication, Admin & Customer APIs')
            .setVersion('1.0')
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'Authorization',
            in: 'header',
        }, 'access-token')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
        logger.log(`📘 Swagger UI enabled`);
    }
    await app.listen(port);
    logger.log(`🚀 Application running on: http://localhost:${port}/api/v1`);
    logger.log(`🌍 Environment: ${nodeEnv}`);
    logger.log(`🔐 Auth endpoints: http://localhost:${port}/api/v1/auth`);
    if (nodeEnv === 'production') {
        logger.log('');
        logger.log('📌 Available Auth Endpoints:');
        logger.log('   POST   /api/v1/auth/admin/login');
        logger.log('   POST   /api/v1/auth/admin/create');
        logger.log('   GET    /api/v1/auth/admin/list');
        logger.log('   PATCH  /api/v1/auth/admin/:id/permissions');
        logger.log('   PATCH  /api/v1/auth/admin/:id/disable');
        logger.log('   PATCH  /api/v1/auth/admin/:id/enable');
        logger.log('   DELETE /api/v1/auth/admin/:id');
        logger.log('   POST   /api/v1/auth/customer/register');
        logger.log('   POST   /api/v1/auth/customer/login');
        logger.log('   POST   /api/v1/auth/refresh');
        logger.log('   POST   /api/v1/auth/logout');
        logger.log('   POST   /api/v1/auth/logout-all');
        logger.log('   GET    /api/v1/auth/me');
        logger.log('');
        logger.log('🔑 How to use Swagger:');
        logger.log('   1. Login via /api/v1/auth/admin/login');
        logger.log('   2. Copy the accessToken from response');
        logger.log('   3. Click "Authorize" button (top right)');
        logger.log('   4. Paste token WITHOUT "Bearer " prefix');
        logger.log('   5. Click "Authorize" then "Close"');
    }
}
bootstrap();
//# sourceMappingURL=main.js.map