import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';
import { VKChatsEnum } from '../common/config/vk.chats.config';
import { ParameterStartInterface } from '../common/interface/parameter.start.interface';
import { DateUtils } from '../common/utils/date.utils';
import { VkUtils } from '../common/utils/vk.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
    private readonly configService: ConfigService,
  ) {}

  async loginUser(data: ParameterStartInterface) {
    await this.vk.api.messages.send({
      message: await this.getTextLogin(data),
      chat_id: VKChatsEnum.LOGS_CHAT,
      random_id: getRandomId(),
      disable_mentions: true,
    });
    return { result: true };
  }

  private async getTextLogin(data: ParameterStartInterface): Promise<string> {
    const user = await this.vk.api.users.get({
      user_id: data.vk_user_id,
    });
    return `@id${data.vk_user_id} (${user[0].first_name} ${
      user[0].last_name
    }) авторизация в приложение (${
      data.vk_app_id === this.configService.get<number>('APP_ID')
        ? 'Dev'
        : 'Prod'
    })\n\n
Время: ${DateUtils.getDateFormatNumber(data.date)}\nIP: ${data.ip}\n\n
vk_ref — ${VkUtils.getRef(data.vk_ref)} (${data.vk_ref})
vk_platform — ${VkUtils.getPlatform(data.vk_platform)} (${data.vk_platform})\n\n
#login #id${data.vk_user_id} #login_${data.vk_user_id}`;
  }
}
