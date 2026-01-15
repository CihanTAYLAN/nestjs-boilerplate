import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { CacheService } from './cache.service';

export const CACHE_INSTANCE = 'CacheInstanceToken';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: CACHE_INSTANCE,
      useFactory: (configService: ConfigService) => {
        const logger = new Logger(CacheModule.name);
        try {
          const cacheConfig = configService.get('cache');
          if (cacheConfig?.type === 'redis') {
            const redisConfig = configService.get('redis');

            if (!redisConfig?.host) {
              logger.log('Redis host not configured, falling back to memory');
              return new Map<string, { value: any; expires: number }>();
            }

            logger.log('Initializing Redis cache client');
            const redisClient = new Redis({
              host: redisConfig.host,
              port: redisConfig.port || 6379,
              password: redisConfig.password || undefined,
              db: parseInt(redisConfig.redisDatabase || '0', 10),
            });

            // Test connection async (but don't await in sync factory)
            redisClient
              .ping()
              .then(() => {
                logger.log('Redis cache client connected successfully');
              })
              .catch((error) => {
                logger.error(
                  'Redis cache connection failed, falling back to memory',
                  error.message,
                );
                // Note: We can't return a different value here since factory is already resolved
                // The cache service will handle Redis errors gracefully
              });

            logger.log('Redis cache client initialized');
            return redisClient;
          } else {
            logger.log('Using Memory Cache (Map-based)');
            return new Map<string, { value: any; expires: number }>();
          }
        } catch (error) {
          logger.error(
            'Error in cache factory, falling back to memory:',
            error.message,
          );
          // Fallback to memory cache on any error
          return new Map<string, { value: any; expires: number }>();
        }
      },
      inject: [ConfigService],
    },
    {
      provide: CacheService,
      useFactory: (cacheInstance: any) => {
        return new CacheService(cacheInstance);
      },
      inject: [CACHE_INSTANCE],
    },
  ],
  exports: [CacheService, CACHE_INSTANCE],
})
export class CacheModule {}
