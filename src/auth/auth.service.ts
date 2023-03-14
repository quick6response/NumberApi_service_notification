import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';
import { UsersUser } from 'vk-io/lib/api/schemas/objects';
import { VKChatsEnum } from '../common/config/vk.chats.config';
import { ParameterStartInterface } from '../common/interface/parameter.start.interface';
import { DateUtils } from '../common/utils/date.utils';
import { VkUtils } from '../common/utils/vk.utils';
import { UsersCreateInterface } from '../users/interface/users.create.interface';

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

  async registrationUser(parameters: UsersCreateInterface) {
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT,
      message: await this.getTextRegistration(parameters),
      random_id: getRandomId(),
      disable_mentions: true,
    });
    return { result: true };
  }

  private async getTextRegistration(
    data: UsersCreateInterface,
  ): Promise<string> {
    const user = await this.getInfoUserVk(data.vk_user_id);
    return `@id${data.vk_user_id} (${user.first_name} ${
      user.last_name
    }) зарегистрировался в приложение (${data.userId}).\n\n
Время: ${DateUtils.getDateFormatNumber(data.date)}\nIP: ${data.ip}\n\n
vk_ref — ${VkUtils.getRef(data.vk_ref)} (${data.vk_ref})
vk_platform — ${VkUtils.getPlatform(data.vk_platform)} (${data.vk_platform})\n\n
#registerUser #id${data.vk_user_id} #registerUser_${data.vk_user_id}`;
  }

  private async getTextLogin(data: ParameterStartInterface): Promise<string> {
    const user = await this.getInfoUserVk(data.vk_user_id);
    return `@id${data.vk_user_id} (${user.first_name} ${
      user.last_name
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

  private async getInfoUserVk(idVk: number): Promise<UsersUser> {
    const user = await this.vk.api.users.get({
      user_id: idVk,
    });
    return user[0];
  }
}
