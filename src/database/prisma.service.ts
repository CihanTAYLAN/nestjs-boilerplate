import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  logger: Logger;
  constructor() {
    // Create a connection pool for PostgreSQL
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Create the Prisma adapter
    const adapter = new PrismaPg(pool);

    super({
      adapter,
      log: ['error', 'warn', 'info'],
      errorFormat: 'pretty',
    });
    this.logger = new Logger('PrismaService');
  }

  async onModuleInit() {
    this.logger.verbose('Prisma client connected to db');
    await this.$connect();
  }

  async onModuleDestroy() {
    this.logger.verbose('Prisma client disconnected to db');
    await this.$disconnect();
  }
}
