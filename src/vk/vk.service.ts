import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectVkApi } from 'nestjs-vk';
import { VK } from 'vk-io';
import { UsersUser } from 'vk-io/lib/api/schemas/objects';

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
  async getInfoUserVk(idVk: number): Promise<UsersUser> {
    const userCache = await this.cacheManager.get<UsersUser>(
      `user_vk_id${idVk}`,
    );
    const userVk =
      userCache ||
      (
        await this.vk.api.users.get({
          user_id: idVk,
        })
      )[0];
    if (!userCache)
      await this.cacheManager.set(`user_vk_id${idVk}`, userVk, 1000 * 60 * 60);

    return userVk;
  }
}
