import { CacheModule as NestCacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';

/**
 * CacheModule от Nest не умеет глобально регистрироваться,
 * поэтому регистрируем его тут со всеми настройками и экспортируем
 */
@Module({
  imports: [
    NestCacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        password: configService.get('REDIS_PASSWORD'),

        ttl: 60 * 10, // кеш на 10 минут
      }),
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}
