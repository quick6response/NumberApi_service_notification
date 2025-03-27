import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from 'redis';
import { parse, stringify } from 'telejson';

import { CacheRepository } from './cache.repository';
import { CacheCompression } from '../constants/cache/cache-compression';

@Injectable()
export class CacheService {
  store: RedisClientType;

  constructor(
    private readonly configService: ConfigService,
    private readonly cacheRepository: CacheRepository,
  ) {}

  async set<Entity>(
    key: string,
    value: Entity,
    ttl: number,
    isAddAppVersionToKey = true,
  ): Promise<void> {
    const data = await this.prepareDataForRedis(value);
    await this.cacheRepository.setEx(
      this.getCacheKey(key, isAddAppVersionToKey),
      ttl,
      data,
    );
  }

  async get<Entity>(
    key: string,
    isAddAppVersionToKey = true,
  ): Promise<Entity | null> {
    const data = await this.cacheRepository.get(
      this.getCacheKey(key, isAddAppVersionToKey),
    );
    if (data !== null) {
      const result = await this.processDataFromRedis<Entity>(data);
      return result;
    }
    return null;
  }

  async del(key: string, isAddAppVersionToKey = true): Promise<void> {
    await this.cacheRepository.delete(
      this.getCacheKey(key, isAddAppVersionToKey),
    );
  }

  private async processDataFromRedis<Entity>(data: string): Promise<Entity> {
    const compressedValue = data.slice(1);
    let value;
    switch (+data[0]) {
      case CacheCompression.NONE: {
        value = compressedValue;
        break;
      }
      default: {
        throw new Error(`Unknown compression type`);
      }
    }
    return parse(value);
  }

  private getCacheKey(key: string, isAddAppVersionToKey = true): string {
    return isAddAppVersionToKey
      ? `${this.configService.get('APP_VERSION')}:${key}`
      : `${key}`;
  }

  private async prepareDataForRedis(value: unknown): Promise<string> {
    const compression = CacheCompression.NONE;
    const data = stringify(value);
    return `${compression}${data}`;
  }
}
