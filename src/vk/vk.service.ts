import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectVkApi } from 'nestjs-vk';
import { VK } from 'vk-io';

@Injectable()
export class VkService {
  private readonly logger = new Logger(VkService.name);

  constructor(
    @InjectVkApi()
    private readonly vk: VK,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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
      await this.cacheManager.set(`user_vk_id${idVk}`, userVk, 1000 * 60 * 60);
    } catch (err) {
      this.logger.error(`Error set cache user vk ${idVk}`, err);
      return null;
    }
  }

  private async getCacheUserVk(idVk: number) {
    try {
      const userCache = await this.cacheManager.get<UserVkInterface>(
        `user_vk_id${idVk}`,
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
