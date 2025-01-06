import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly appVersion: string;
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    this.appVersion = this.configService.get<string>('APP_VERSION');
  }

  async get<T>(key: string): Promise<T | null> {
    return this.cacheManager.get<T>(this.getCacheKey(key));
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    return this.cacheManager.set(this.getCacheKey(key), value, ttl);
  }

  private getCacheKey(key: string) {
    return `${this.appVersion}:${key}`;
  }
}
