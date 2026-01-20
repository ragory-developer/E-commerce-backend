import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private prisma: ReturnType<typeof this.createPrismaClient>;
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    this.prisma = this.createPrismaClient();
  }

  private createPrismaClient() {
    const adapter = new PrismaPg(this.pool);

    return new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    }).$extends({
      query: {
        $allModels: {
          async findMany({ args, query }) {
            const where = args?.where as any;
            if (
              where &&
              'isDeleted' in where &&
              where.isDeleted === undefined
            ) {
              args.where = { ...where, isDeleted: false };
            }
            return query(args);
          },
          async findFirst({ args, query }) {
            const where = args?.where as any;
            if (
              where &&
              'isDeleted' in where &&
              where.isDeleted === undefined
            ) {
              args.where = { ...where, isDeleted: false };
            }
            return query(args);
          },
        },
      },
    });
  }

  async onModuleInit() {
    await this.prisma.$connect();
    this.logger.log('Database connected');
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
    await this.pool.end();
    this.logger.warn('Database disconnected');
  }

  get client() {
    return this.prisma;
  }
}
