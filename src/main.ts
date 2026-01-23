/**
 * MAIN. TS - Application Entry Point
 *
 * This file bootstraps (starts) the NestJS application.
 * It configures:
 * - Global prefix for all routes
 * - CORS (Cross-Origin Resource Sharing)
 * - Validation pipe (auto-validate all DTOs)
 * - Security headers (Helmet)
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create the NestJS application
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Get configuration service
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  const nodeEnv = configService.get<string>('nodeEnv');

  // Create logger
  const logger = new Logger('Bootstrap');

  // ================================
  // SECURITY:  Helmet adds security headers
  // ================================
  app.use(helmet());

  // ================================
  // CORS: Allow cross-origin requests
  // ================================
  app.enableCors({
    origin:
      nodeEnv === 'production'
        ? ['https://yourfrontend.com'] // Restrict in production
        : true, // Allow all in development
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // ================================
  // GLOBAL PREFIX:  All routes start with /api/v1
  // Example: /api/v1/auth/login
  // ================================
  app.setGlobalPrefix('api/v1');

  // ================================
  // VALIDATION PIPE: Auto-validate all incoming data
  // ================================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in DTO
      forbidNonWhitelisted: true, // Throw error if extra properties sent
      transform: true, // Auto-transform to DTO class instance
      transformOptions: {
        enableImplicitConversion: true, // Convert strings to numbers, etc.
      },
      disableErrorMessages: nodeEnv === 'production', // Hide details in production
    }),
  );

  // ================================
  // START SERVER
  // ================================
  await app.listen(port);

  // Log startup information
  logger.log(`🚀 Application running on: http://localhost:${port}/api/v1`);
  logger.log(`📝 Environment: ${nodeEnv}`);
  logger.log(`🔐 Auth endpoints: http://localhost:${port}/api/v1/auth`);

  if (nodeEnv === 'development') {
    logger.log('');
    logger.log('📌 Available Auth Endpoints:');
    logger.log('   POST /api/v1/auth/admin/login      - Admin login');
    logger.log(
      '   POST /api/v1/auth/admin/create     - Create admin (SuperAdmin only)',
    );
    logger.log(
      '   GET  /api/v1/auth/admin/list       - List admins (SuperAdmin only)',
    );
    logger.log(
      '   POST /api/v1/auth/customer/register - Customer registration',
    );
    logger.log('   POST /api/v1/auth/customer/login   - Customer login');
    logger.log('   POST /api/v1/auth/refresh          - Refresh tokens');
    logger.log('   POST /api/v1/auth/logout           - Logout');
    logger.log('   GET  /api/v1/auth/me               - Get profile');
  }
}

bootstrap();
