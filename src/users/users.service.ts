import { Injectable } from '@nestjs/common';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';
import { VKChatsEnum } from '../common/config/vk.chats.config';
import { DateUtils } from '../common/utils/date.utils';
import { VkUtils } from '../common/utils/vk.utils';
import { UsersCreateInterface } from './interface/users.create.interface';

@Injectable()
export class UsersService {
  constructor(@InjectVkApi() private readonly vk: VK) {}

  async notificationNewUser(parameters: UsersCreateInterface) {
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT,
      message: await this.getTextNewUser(parameters),
      random_id: getRandomId(),
      disable_mentions: true,
    });
    return { result: true };
  }

  private async getTextNewUser(data: UsersCreateInterface): Promise<string> {
    const user = await this.vk.api.users.get({
      user_id: data.vk_user_id,
    });
    return `@id${data.vk_user_id} (${user[0].first_name} ${
      user[0].last_name
    }) зарегистрировался.\n\n
Время: ${DateUtils.getDateFormatNumber(data.date)}\nIP: ${data.ip}\n\n
vk_ref — ${VkUtils.getRef(data.vk_ref)} (${data.vk_ref})
vk_platform — ${VkUtils.getPlatform(data.vk_platform)} (${data.vk_platform})\n\n
#registerUser #id${data.vk_user_id} #registerUser_${data.vk_user_id}`;
  }
}
