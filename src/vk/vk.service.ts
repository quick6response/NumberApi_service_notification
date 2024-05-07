import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectVkApi } from 'nestjs-vk';
import { VK } from 'vk-io';

@Injectable()
export class VkService {
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
    const userCache = await this.cacheManager.get<UserVkInterface>(
      `user_vk_id${idVk}`,
    );
    const userVk =
      userCache ||
      ((
        await this.vk.api.users.get({
          user_id: idVk,
        })
      )[0] as UserVkInterface);
    if (!userCache)
      await this.cacheManager.set(`user_vk_id${idVk}`, userVk, 1000 * 60 * 60);

    return userVk;
  }
}

export interface UserVkInterface {
  id: number;
  first_name: string;
  last_name: string;
  can_access_closed: boolean;
  is_closed: boolean;
}
