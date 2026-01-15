import { Injectable, Logger } from '@nestjs/common';
import { ExampleEnum } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class SystemListVariablesService {
  private readonly logger = new Logger(SystemListVariablesService.name);

  constructor(
    private readonly _prisma: PrismaService,
    private readonly _cacheService: CacheService,
  ) {}

  /**
   * Get all example enum list
   * Returns all example enum list from the database with caching
   */
  async getExampleEnumList(): Promise<any[]> {
    try {
      const cacheKey = 'system-list-variables:example-enum';

      const data = await this._cacheService.getOrSet(
        cacheKey,
        async () => {
          return Object.values(ExampleEnum);
        },
        { ttl: 3600 }, // 1 hour TTL in seconds
      );

      return data;
    } catch (error) {
      this.logger.error('Error retrieving example enum list', error.stack);
      throw new Error('Failed to retrieve example enum list');
    }
  }
}
