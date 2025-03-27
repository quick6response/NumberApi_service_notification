import { Inject, Injectable } from '@nestjs/common';
import { createClient } from 'redis';

export type RedisClientType = ReturnType<typeof createClient>;

@Injectable()
export class CacheRepository {
  constructor(
    @Inject('redisClient') private readonly redisClient: RedisClientType,
  ) {}

  public async mGet(keys: string[]): Promise<(string | null)[]> {
    return this.redisClient.mGet(keys);
  }

  public async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  public async set(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  public async setEx(
    key: string,
    expiresIn: number,
    value: string,
  ): Promise<void> {
    await this.redisClient.setEx(key, expiresIn, value);
  }

  public async delete(key: string): Promise<void> {
    await this.redisClient.unlink(key);
  }
}
