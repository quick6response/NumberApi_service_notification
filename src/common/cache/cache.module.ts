import { Global, Module } from '@nestjs/common';

import { redisClientFactory } from './cache.factory';
import { CacheRepository } from './cache.repository';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [CacheService, redisClientFactory, CacheRepository],
  exports: [CacheService],
})
export class CacheModule {}
