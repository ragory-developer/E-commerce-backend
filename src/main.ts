/**
 * MAIN.TS - Application Entry Point
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') ?? 3000;
  const nodeEnv = configService.get<string>('nodeEnv') ?? 'development';

  const logger = new Logger('Bootstrap');

  app.use(helmet());

  app.enableCors({
    origin: nodeEnv === 'production' ? ['https://yourfrontend.com'] : true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: nodeEnv === 'production',
    }),
  );

  await app.listen(port);

  logger.log(`🚀 Application running on: http://localhost:${port}/api/v1`);
  logger.log(`📝 Environment: ${nodeEnv}`);
  logger.log(`🔐 Auth endpoints: http://localhost:${port}/api/v1/auth`);

  if (nodeEnv === 'development') {
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
  }
}

bootstrap();
