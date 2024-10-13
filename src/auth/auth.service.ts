import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientPlatform,
  getClientInfoByPlatform,
} from '@quick_response/number_api_event';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, Keyboard, VK } from 'vk-io';
import { VKChatsEnum } from '../common/config/vk.chats.config';
import { dateUtils } from '../common/utils/date.utils';
import { messageTagVkMiniAppsActionUtils } from '../common/utils/message.platform.tag.utils';
import { VkUtils } from '../common/utils/vk.utils';
import { VkService } from '../vk/vk.service';
import { VkAuthLoginDto, VkAuthRegistrationDto } from './dto/vk.auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
    private readonly configService: ConfigService,
    private readonly vkHelpService: VkService,
  ) {}

  async loginUser(parameters: VkAuthLoginDto) {
    if (parameters.clientPlatform === ClientPlatform.VK) {
      const { clientInfo } = getClientInfoByPlatform(
        parameters.clientPlatform,
        parameters.clientInfo,
      );
      await this.vk.api.messages.send({
        message: await this.getTextLogin(parameters),
        chat_id: VKChatsEnum.LOGS_CHAT_DEV,
        random_id: getRandomId(),
        disable_mentions: true,
        attachments: ['article-208805276_239161-266dfc55f402bb4b77'],
        keyboard: this.getKeyboardFindUser(
          parameters.user.id,
          clientInfo.vk_app_id,
        ),
      });
    }
    return { result: true };
  }

  async registrationUser(parameters: VkAuthRegistrationDto) {
    if (parameters.clientPlatform === ClientPlatform.VK) {
      const { clientInfo } = getClientInfoByPlatform(
        parameters.clientPlatform,
        parameters.clientInfo,
      );

      await this.vk.api.messages.send({
        chat_id: VKChatsEnum.LOGS_CHAT_DEV,
        message: await this.getTextRegistration(parameters),
        random_id: getRandomId(),
        disable_mentions: true,
        keyboard: this.getKeyboardFindUser(
          parameters.user.id,
          clientInfo.vk_app_id,
        ),
      });
    }
    return { result: true };
  }

  private async getTextRegistration(
    parameters: VkAuthRegistrationDto,
  ): Promise<string> {
    if (parameters.clientPlatform === ClientPlatform.VK) {
      const { clientInfo } = getClientInfoByPlatform(
        parameters.clientPlatform,
        parameters.clientInfo,
      );

      const user = await this.vkHelpService.getInfoUserVk(
        clientInfo.vk_user_id,
      );
      return `@id${clientInfo.vk_user_id} (${user.first_name} ${
        user.last_name
      }) зарегистрировался в приложение (${parameters.user.id}).\n\n
Время: ${dateUtils.getDateFormatNumber(parameters.date)}\nIP: ${clientInfo.ip}\n\n
vk_ref — ${VkUtils.getRef(clientInfo.vk_ref)} (${clientInfo.vk_ref})
vk_platform — ${VkUtils.getPlatform(clientInfo.vk_platform)} (${clientInfo.vk_platform})\n\n
${messageTagVkMiniAppsActionUtils.getTagPlatform()} ${messageTagVkMiniAppsActionUtils.getTagAuth('registration')} ${messageTagVkMiniAppsActionUtils.getTagUserAction(parameters.user.id, clientInfo.vk_user_id)}`;
    }
  }

  private async getTextLogin(parameters: VkAuthLoginDto): Promise<string> {
    if (parameters.clientPlatform === ClientPlatform.VK) {
      const { clientInfo } = getClientInfoByPlatform(
        parameters.clientPlatform,
        parameters.clientInfo,
      );

      const user = await this.vkHelpService.getInfoUserVk(
        clientInfo.vk_user_id,
      );
      return `@id${user.id} (${user.first_name} ${
        user.last_name
      }) авторизация в приложение (${
        clientInfo.vk_app_id == this.configService.get<number>('APP_ID')
          ? 'Dev'
          : 'Prod'
      })\n\n
Время: ${dateUtils.getDateFormatNumber(parameters.date)}\nIP: ${clientInfo.ip}\n\n
vk_ref — ${VkUtils.getRef(clientInfo.vk_ref)} (${clientInfo.vk_ref})
vk_platform — ${VkUtils.getPlatform(clientInfo.vk_platform)} (${clientInfo.vk_platform})\n\n
${messageTagVkMiniAppsActionUtils.getTagPlatform()} ${messageTagVkMiniAppsActionUtils.getTagAuth('login')} ${messageTagVkMiniAppsActionUtils.getTagUserAction(parameters.user.id, clientInfo.vk_user_id)}`;
    }
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
