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
import { messageTagUtils } from '../common/utils/message.tag.utils';
import { NumbersService } from '../numbers/numbers.service';
import { VkService } from '../vk/vk.service';
import {
  VkCommentCreateDto,
  VkCommentDeleteDto,
  VkCommentEditDto,
} from './dto/vk.comment.dto';
import { VkModerationCommentDto } from './dto/vk.moderation.comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
    private readonly numberService: NumbersService,
    private readonly vkHelpService: VkService,
    private readonly configService: ConfigService,
  ) {}

  async commentCreate(parameters: VkCommentCreateDto) {
    if (parameters.clientPlatform === ClientPlatform.VK) {
      const { clientInfo } = getClientInfoByPlatform(
        parameters.clientPlatform,
        parameters.clientInfo,
      );
      await this.vk.api.messages.send({
        chat_id: VKChatsEnum.LOGS_CHAT_DEV,
        message: await this.getTextCommentCreate(parameters),
        random_id: getRandomId(),
        disable_mentions: true,
        keyboard: this.getKeyboardModerationComment(
          {
            number: parameters.comment.number,
            userId: parameters.user.id,
          },
          clientInfo.vk_app_id,
        ),
        content_source: this.getContentSource(clientInfo.vk_app_id),
      });
      return { result: true };
    }
  }

  async commentDelete(parameters: VkCommentDeleteDto) {
    if (parameters.clientPlatform === ClientPlatform.VK) {
      const { clientInfo } = getClientInfoByPlatform(
        parameters.clientPlatform,
        parameters.clientInfo,
      );
      await this.vk.api.messages.send({
        chat_id: VKChatsEnum.LOGS_CHAT_DEV,
        message: await this.getTextCommentDelete(parameters),
        random_id: getRandomId(),
        disable_mentions: true,
        content_source: this.getContentSource(clientInfo.vk_app_id),
      });
      return { result: true };
    }
  }

  async commentEdit(parameters: VkCommentEditDto) {
    if (parameters.clientPlatform === ClientPlatform.VK) {
      const { clientInfo } = getClientInfoByPlatform(
        parameters.clientPlatform,
        parameters.clientInfo,
      );
      await this.vk.api.messages.send({
        chat_id: VKChatsEnum.LOGS_CHAT_DEV,
        message: await this.getTextCommentEdit(parameters),
        random_id: getRandomId(),
        disable_mentions: true,
        content_source: this.getContentSource(clientInfo.vk_app_id),
      });
      return { result: true };
    }
  }

  async moderationCommentNumber(parameters: VkModerationCommentDto) {
    if (parameters.clientPlatform === ClientPlatform.VK) {
      const { clientInfo } = getClientInfoByPlatform(
        parameters.clientPlatform,
        parameters.clientInfo,
      );
      await this.vk.api.messages.send({
        chat_id: VKChatsEnum.LOGS_CHAT_DEV,
        message: await this.getTextModerationComment(parameters),
        random_id: getRandomId(),
        disable_mentions: true,
        content_source: this.getContentSource(clientInfo.vk_app_id),
      });
      return { result: true };
    }
  }

  private async getTextCommentCreate(parameters: VkCommentCreateDto) {
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
      }) оставил комментарий №${
        parameters.comment.commentId
      } на номер ${this.numberService.convertToFormat(
        parameters.comment.number,
      )}\nТекст: ${parameters.comment.text} (${
        parameters.comment.isAnon ? 'Анонимный' : 'Обычный'
      })
    
Время: ${dateUtils.getDateFormatNumber(parameters.date)}
IP: ${clientInfo.ip}

${messageTagVkMiniAppsActionUtils.getTagPlatform()} ${messageTagUtils.getTagComment(parameters.comment.commentId, 'create')} ${messageTagUtils.getTagNumber(parameters.comment.number, parameters.comment.numberId)} ${messageTagVkMiniAppsActionUtils.getTagUserAction(parameters.comment.userId, clientInfo.vk_user_id)}`;
    }
  }

  private async getTextCommentDelete(parameters: VkCommentDeleteDto) {
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
      }) удалил комментарий №${
        parameters.comment.commentId
      } на номер ${this.numberService.convertToFormat(parameters.comment.number)}
    
Время: ${dateUtils.getDateFormatNumber(parameters.date)}
IP: ${clientInfo.ip}

${messageTagVkMiniAppsActionUtils.getTagPlatform()} ${messageTagUtils.getTagComment(parameters.comment.commentId, 'delete')} ${messageTagUtils.getTagNumber(parameters.comment.number, parameters.comment.numberId)} ${messageTagVkMiniAppsActionUtils.getTagUserAction(parameters.comment.userId, clientInfo.vk_user_id)}`;
    }
  }

  private async getTextCommentEdit(parameters: VkCommentEditDto) {
    if (parameters.clientPlatform === ClientPlatform.VK) {
      const { clientInfo } = getClientInfoByPlatform(
        parameters.clientPlatform,
        parameters.clientInfo,
      );
      const user = await this.vkHelpService.getInfoUserVk(
        clientInfo.vk_user_id,
      );
      const checkChangeColumns = parameters.changes;

      return `@id${user.id} (${user.first_name} ${
        user.last_name
      }) изменил комментарий №${
        parameters.nextComment.commentId
      } на номер ${this.numberService.convertToFormat(parameters.nextComment.number)}\n
    Изменения: ${checkChangeColumns.join(',')}\n
    Текст: ${parameters.prevComment.text} -> ${parameters.nextComment.text}\n
    Анонимность ${parameters.prevComment.isAnon} -> ${parameters.nextComment.isAnon}\n
    
Время: ${dateUtils.getDateFormatNumber(parameters.date)}
IP: ${clientInfo.ip}

${messageTagVkMiniAppsActionUtils.getTagPlatform()} ${messageTagUtils.getTagComment(parameters.nextComment.commentId, 'edit')} ${messageTagUtils.getTagNumber(parameters.nextComment.number, parameters.nextComment.numberId)} ${messageTagVkMiniAppsActionUtils.getTagUserAction(parameters.nextComment.userId, clientInfo.vk_user_id)}`;
    }
  }

  private async getTextModerationComment(parameters: VkModerationCommentDto) {
    if (parameters.clientPlatform === ClientPlatform.VK) {
      const { clientInfo } = getClientInfoByPlatform(
        parameters.clientPlatform,
        parameters.clientInfo,
      );
      const user = await this.vkHelpService.getInfoUserVk(
        clientInfo.vk_user_id,
      );
      const text = `@id${user.id} (${user.first_name} ${
        user.last_name
      }) (Роль ${parameters.user.role}) выполнил модерацию комментария с текстом: "${parameters.comment.text}"
    
Статус изменен с "${parameters.comment.prevStatus}" на "${
        parameters.comment.status
      }"\n
Время: ${dateUtils.getDateFormatNumber(parameters.date)}
IP: ${clientInfo.ip}

${messageTagVkMiniAppsActionUtils.getTagPlatform()} ${messageTagUtils.getTagComment(parameters.comment.commentId, 'moderation')} ${messageTagUtils.getTagNumber(parameters.comment.number, parameters.comment.numberId)} ${messageTagVkMiniAppsActionUtils.getTagUserAction(parameters.user.id, clientInfo.vk_user_id)}`;

      return text;
    }
  }

  private getContentSource(
    appId: number = this.configService.get<number>('APP_ID'),
  ) {
    return JSON.stringify({
      type: 'url',
      url: `https://vk.com/app${appId}`,
    });
  }

  getKeyboardModerationComment(
    comment: { number: string; userId: number },
    appId: number = this.configService.get<number>('APP_ID'),
  ) {
    const builder = Keyboard.keyboard([
      // Одна кнопка
      [
        Keyboard.applicationButton({
          label: 'Модерация комментария',
          hash: 'admin/moderation',
          appId: appId,
        }),
        Keyboard.applicationButton({
          label: 'Информация о номере',
          hash: `number/?number=${comment.number}`,
          appId: appId,
        }),
      ],
      [
        Keyboard.applicationButton({
          label: 'Информация о пользователе',
          hash: `user/info?userId=${comment.userId}`,
          appId: appId,
        }),
      ],
    ]).inline();
    return builder;
  }
}
