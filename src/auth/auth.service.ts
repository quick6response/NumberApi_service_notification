import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, Keyboard, VK } from 'vk-io';
import { VKChatsEnum } from '../common/config/vk.chats.config';
import { dateUtils } from '../common/utils/date.utils';
import { VkUtils } from '../common/utils/vk.utils';
import { VkService } from '../vk/vk.service';
import { AuthLoginDto } from './dto/auth.login.dto';
import { AuthRegisterDto } from './dto/auth.register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
    private readonly configService: ConfigService,
    private readonly vkHelpService: VkService,
  ) {}

  async loginUser(parameters: AuthLoginDto) {
    await this.vk.api.messages.send({
      message: await this.getTextLogin(parameters),
      chat_id: VKChatsEnum.LOGS_CHAT_DEV,
      random_id: getRandomId(),
      disable_mentions: true,
      attachments: ['article-208805276_239161-266dfc55f402bb4b77'],
      keyboard: this.getKeyboardFindUser(
        parameters.userId,
        parameters.vk_app_id,
      ),
    });
    return { result: true };
  }

  async registrationUser(parameters: AuthRegisterDto) {
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT_DEV,
      message: await this.getTextRegistration(parameters),
      random_id: getRandomId(),
      disable_mentions: true,
      keyboard: this.getKeyboardFindUser(
        parameters.userId,
        parameters.vk_app_id,
      ),
    });
    return { result: true };
  }

  private async getTextRegistration(data: AuthRegisterDto): Promise<string> {
    const user = await this.vkHelpService.getInfoUserVk(data.vk_user_id);
    return `@id${data.vk_user_id} (${user.first_name} ${
      user.last_name
    }) зарегистрировался в приложение (${data.userId}).\n\n
Время: ${dateUtils.getDateFormatNumber(data.date)}\nIP: ${data.ip}\n\n
vk_ref — ${VkUtils.getRef(data.vk_ref)} (${data.vk_ref})
vk_platform — ${VkUtils.getPlatform(data.vk_platform)} (${data.vk_platform})\n\n
#registerUser #id${data.userId} #vk_id${data.vk_user_id}`;
  }

  private async getTextLogin(data: AuthLoginDto): Promise<string> {
    const user = await this.vkHelpService.getInfoUserVk(data.vk_user_id);
    return `@id${data.vk_user_id} (${user.first_name} ${
      user.last_name
    }) авторизация в приложение (${
      data.vk_app_id === this.configService.get<number>('APP_ID')
        ? 'Dev'
        : 'Prod'
    })\n\n
Время: ${dateUtils.getDateFormatNumber(data.date)}\nIP: ${data.ip}\n\n
vk_ref — ${VkUtils.getRef(data.vk_ref)} (${data.vk_ref})
vk_platform — ${VkUtils.getPlatform(data.vk_platform)} (${data.vk_platform})\n\n
#login #id${data.userId} #vk_id${data.vk_user_id}`;
  }

  private getKeyboardFindUser(userId: number, appId: number) {
    const builder = Keyboard.keyboard([
      // Одна кнопка
      [
        Keyboard.applicationButton({
          label: 'Информация о пользователе',
          hash: 'admin/moderation',
          appId: appId,
        }),
      ],
      [
        Keyboard.callbackButton({
          label: 'Информация',
          color: 'secondary',
          payload: {
            type: 'text',
            text: `userId_${userId}`,
            cmd: 'find user',
          },
        }),
        Keyboard.callbackButton({
          label: 'Временный бан',
          color: 'negative',
          payload: {
            type: 'text',
            text: `userId_${userId}`,
            cmd: 'ban user 1h',
          },
        }),
      ],
    ]).inline();
    return builder;
  }
}
