import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';

import { dateUtils } from '../common/utils/date.utils';
import { VkService } from '../vk/vk.service';
import { UserNumberNotificationDto } from './dto/user.number.notification.dto';

@Injectable()
export class UserNumberService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly vkHelpService: VkService,
    @InjectVkApi()
    private readonly vk: VK,
  ) {}

  /**
   * Уведомления о просмотре номера человека
   */
  async notificationFindNumber(parameters: UserNumberNotificationDto) {
    await this.vk.api.messages.send({
      user_id: parameters.userId,
      message: await this.getTextNotificationFind(parameters),
      random_id: getRandomId(),
      disable_mentions: true,
    });
  }

  private async getTextNotificationFind(parameters: UserNumberNotificationDto) {
    const user = await this.vkHelpService.getInfoUserVk(parameters.userId);
    if (!parameters.isBlock)
      return `💬🔔${
        user.first_name
      }, кто-то просмотрел информацию о Вашем номере телефона (${
        parameters.number.slice(7, 9) + `-` + parameters.number.slice(9, 12)
      }).\n
Время ${dateUtils.getDateFormatNumber(parameters.date)}
`;
    else
      return `💬⛔${
        user.first_name
      }, кто-то пытался просмотреть информацию о Вашем номере телефона (${
        parameters.number.slice(7, 9) + `-` + parameters.number.slice(9, 12)
      }).\n
Время ${dateUtils.getDateFormatNumber(parameters.date)}
`;
  }
}
