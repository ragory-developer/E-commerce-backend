/**
 * PRISMA SERVICE
 *
 * This is the database connection service.
 * It extends PrismaClient, giving you access to all Prisma methods.
 *
 * USAGE IN OTHER SERVICES:
 *   constructor(private prisma: PrismaService) {}
 *
 *   async findUser(id: string) {
 *     return this.prisma.admin.findUnique({ where: { id } });
 *   }
 */

import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      // Log database queries in development
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });
  }

  /**
   * Called when NestJS module initializes
   * Connects to the database
   */
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect to database', error);
      throw error;
    }
  }

  /**
   * Called when NestJS module is destroyed
   * Disconnects from the database
   */
  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }
}
