import { FactoryProvider, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { RedisClientType } from 'redis';
import { createClient } from 'redis';

export const redisClientFactory: FactoryProvider<RedisClientType> = {
  provide: 'redisClient',
  inject: [ConfigService],
  useFactory: async (config: ConfigService): Promise<RedisClientType> => {
    const logger = new Logger('redisClient');

    const url = config.get('REDIS_URL');

    if (!url) {
      throw new Error('Redis connection url is not defined');
    }

    const redisClient: RedisClientType = createClient({
      url,
    });

    // Должно висеть событие для автоматического переподключения
    redisClient.on('error', (error) => {
      logger.error(error);
    });

    await redisClient.connect();

    return redisClient;
  },
};
