import * as path from 'node:path';
import { Injectable, Logger } from '@nestjs/common';

export interface CacheServiceOptions {
  ttl?: number;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  private readonly version: string;

  constructor(private cacheManager: any) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const packageJson = require(path.join(process.cwd(), 'package.json'));
    this.version = packageJson.version;
  }

  private getVersionedKey(key: string, version?: string): string {
    return `v${version || this.version}:${key}`;
  }

  /**
   * Get a value from cache
   */
  async get<T = any>(key: string, version?: string): Promise<T | undefined> {
    const versionedKey = this.getVersionedKey(key, version);
    try {
      // Check if Redis client or Map
      if (this.cacheManager instanceof Map) {
        const item = this.cacheManager.get(versionedKey);
        if (!item) return undefined;

        if (Date.now() > item.expires) {
          this.cacheManager.delete(versionedKey);
          return undefined;
        }

        return item.value;
      } else {
        // Redis client
        const data = await (this.cacheManager as any).get(versionedKey);
        return data ? JSON.parse(data) : undefined;
      }
    } catch (error) {
      this.logger.error(`Failed to get cache key: ${key}`, error);
      return undefined;
    } finally {
      this.logger.debug(`CACHE HIT: ${versionedKey}`);
    }
  }

  /**
   * Set a value in cache with optional TTL
   */
  async set<T = any>(
    key: string,
    value: T,
    options: CacheServiceOptions = {},
    version?: string,
  ): Promise<void> {
    try {
      const ttl = options.ttl ?? 3600; // Default 1 hour

      // Check if Redis client or Map
      if (this.cacheManager instanceof Map) {
        // Memory simulation
        const expires = Date.now() + ttl * 1000;
        const versionedKey = this.getVersionedKey(key, version);
        this.cacheManager.set(versionedKey, { value, expires });
      } else {
        // Redis client
        const serializedValue = JSON.stringify(value);
        const ttlSeconds = Math.ceil(ttl);
        const versionedKey = this.getVersionedKey(key, version);
        await (this.cacheManager as any).setex(
          versionedKey,
          ttlSeconds,
          serializedValue,
        );
      }

      this.logger.debug(`CACHE SET: ${this.getVersionedKey(key, version)}`);
    } catch (error) {
      console.log(`❌ CACHE SET ERROR: ${key}, ${error.message}`);
      this.logger.error(`Failed to set cache key: ${key}`, error);
    }
  }

  /**
   * Delete a value from cache
   */
  async del(key: string, version?: string): Promise<void> {
    try {
      const versionedKey = this.getVersionedKey(key, version);
      if (this.cacheManager instanceof Map) {
        this.cacheManager.delete(versionedKey);
      } else {
        await (this.cacheManager as any).del(versionedKey);
      }
    } catch (error) {
      this.logger.error(`Failed to delete cache key: ${key}`, error);
    }
  }

  /**
   * Clear all cache (if supported by the underlying store)
   */
  async reset(): Promise<void> {
    try {
      if (
        'reset' in this.cacheManager &&
        typeof this.cacheManager.reset === 'function'
      ) {
        await this.cacheManager.reset();
      } else {
        this.logger.warn('Cache reset not supported by current cache store');
      }
    } catch (error) {
      this.logger.error('Failed to reset cache', error);
    }
  }

  /**
   * Check if a key exists in cache
   */
  async has(key: string, version?: string): Promise<boolean> {
    try {
      const value = await this.get(key, version);
      return value !== undefined;
    } catch (error) {
      this.logger.error(`Failed to check cache key existence: ${key}`, error);
      return false;
    }
  }

  /**
   * Get or set cache value with callback
   */
  async getOrSet<T = any>(
    key: string,
    callback: () => Promise<T>,
    options: CacheServiceOptions = {},
    version?: string,
  ): Promise<T> {
    const cachedValue = await this.get<T>(key, version);
    if (cachedValue !== undefined) {
      return cachedValue;
    }

    const value = await callback();
    await this.set(key, value, options, version);
    return value;
  }
}
