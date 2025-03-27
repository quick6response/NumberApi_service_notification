import { Injectable, Logger } from '@nestjs/common';
import { InjectVkApi } from 'nestjs-vk';
import { VK } from 'vk-io';

import { CacheService } from '../common/cache/cache.service';

@Injectable()
export class VkService {
  private readonly logger = new Logger(VkService.name);

  private getVkUserProfileCacheKey(idVk: number) {
    return `user_vk_id:${idVk}`;
  }

  constructor(
    @InjectVkApi()
    private readonly vk: VK,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Получить информацию о пользователе
   * @param idVk
   * @private
   */
  async getInfoUserVk(idVk: number): Promise<UserVkInterface> {
    try {
      const userCache = await this.getCacheUserVk(idVk);

      if (userCache) {
        return userCache;
      }

      const [userVk] = (await this.vk.api.users.get({
        user_id: idVk,
      })) as UserVkInterface[];

      if (userVk) {
        await this.setCacheUserVk(idVk, userVk);
      }

      return userVk;
    } catch (err) {
      this.logger.error(`Error get info user vk ${idVk}`, err);
      return {
        can_access_closed: false,
        first_name: 'не определено',
        id: idVk,
        is_closed: false,
        last_name: 'не определено',
      };
    }
  }

  private async setCacheUserVk(idVk: number, userVk: UserVkInterface) {
    try {
      await this.cacheService.set(
        this.getVkUserProfileCacheKey(idVk),
        userVk,
        60 * 60 * 48,
      );
    } catch (err) {
      this.logger.error(`Error set cache user vk ${idVk}`, err);
      return null;
    }
  }

  private async getCacheUserVk(idVk: number) {
    try {
      const userCache = await this.cacheService.get<UserVkInterface>(
        this.getVkUserProfileCacheKey(idVk),
      );
      return userCache;
    } catch (err) {
      this.logger.error(`Error get cache user vk ${idVk}`, err);
      return null;
    }
  }
}

export interface UserVkInterface {
  id: number;
  first_name: string;
  last_name: string;
  can_access_closed: boolean;
  is_closed: boolean;
}
