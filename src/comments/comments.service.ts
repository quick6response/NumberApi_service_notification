import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectVkApi } from 'nestjs-vk';
import { NumberCommentStatus } from 'numberapi-common/database';
import { ClientPlatform } from 'numberapi-common/microservice';
import {
  getClientInfoByPlatform,
  NumberCommentCreatedDto,
  NumberCommentDeletedDto,
  NumberCommentEditedDto,
  NumberCommentModeratedDto,
} from 'numberapi-common/microservice/notification';
import { getRandomId, Keyboard, VK } from 'vk-io';

import { VKChatsEnum } from '../common/config/vk.chats.config';
import { dateUtils } from '../common/utils/date.utils';
import { messageTagVkMiniAppsActionUtils } from '../common/utils/message.platform.tag.utils';
import { messageTagUtils } from '../common/utils/message.tag.utils';
import { NumbersService } from '../numbers/numbers.service';
import { VkService } from '../vk/vk.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
    private readonly numberService: NumbersService,
    private readonly vkHelpService: VkService,
    private readonly configService: ConfigService,
  ) {}

  async commentCreate(parameters: NumberCommentCreatedDto) {
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
            number: parameters.number.number,
            userId: parameters.user.userId,
          },
          clientInfo.vk_app_id,
        ),
        content_source: this.getContentSource(clientInfo.vk_app_id),
      });
      return { result: true };
    }
  }

  async commentDelete(parameters: NumberCommentDeletedDto) {
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

  async commentEdit(parameters: NumberCommentEditedDto) {
    if (parameters.clientPlatform === ClientPlatform.VK) {
      const { clientInfo } = getClientInfoByPlatform(
        parameters.clientPlatform,
        parameters.clientInfo,
      );
      await this.vk.api.messages.send({
        chat_id: VKChatsEnum.LOGS_CHAT_DEV,
        message: await this.getTextCommentEdit(parameters),
        random_id: getRandomId(),
        keyboard: this.getKeyboardModerationComment(
          {
            number: parameters.number.number,
            userId: parameters.user.userId,
          },
          clientInfo.vk_app_id,
        ),
        disable_mentions: true,
        content_source: this.getContentSource(clientInfo.vk_app_id),
      });
      return { result: true };
    }
  }

  async moderationCommentNumber(parameters: NumberCommentModeratedDto) {
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

  private async getTextCommentCreate(parameters: NumberCommentCreatedDto) {
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
        parameters.comment.id
      } на номер ${this.numberService.convertToFormat(
        parameters.number.number,
      )}\nТекст: ${parameters.comment.text} (Видимость: ${
        parameters.comment.isAnon ? 'Анонимный' : 'Обычный'
      })
    
Время: ${dateUtils.getDateFormatNumber(parameters.date)}
IP: ${clientInfo.ip}

${messageTagVkMiniAppsActionUtils.getTagPlatform()} ${messageTagUtils.getTagComment(parameters.comment.id, 'create')} ${messageTagUtils.getTagNumber(parameters.number.number, parameters.number.numberId)} ${messageTagVkMiniAppsActionUtils.getTagUserAction(parameters.user.userId, clientInfo.vk_user_id)}`;
    }
  }

  private async getTextCommentDelete(parameters: NumberCommentDeletedDto) {
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
      }) удалил свой комментарий на номер ${this.numberService.convertToFormat(parameters.number.number)}
    
Время: ${dateUtils.getDateFormatNumber(parameters.date)}
IP: ${clientInfo.ip}

${messageTagVkMiniAppsActionUtils.getTagPlatform()} ${messageTagUtils.getTagComment(parameters.comment.id, 'delete')} ${messageTagUtils.getTagNumber(parameters.number.number, parameters.number.numberId)} ${messageTagVkMiniAppsActionUtils.getTagUserAction(parameters.user.userId, clientInfo.vk_user_id)}`;
    }
  }

  private async getTextCommentEdit(parameters: NumberCommentEditedDto) {
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
      }) отредактировал свой комментарий на номер ${this.numberService.convertToFormat(parameters.number.number)}
      
Изменились поля: ${checkChangeColumns.join(', ')}\n
Текст: ${parameters.previousComment.text} -> ${parameters.updatedComment.text}
Анонимность ${parameters.previousComment.isAnon} -> ${parameters.updatedComment.isAnon}
    
Время: ${dateUtils.getDateFormatNumber(parameters.date)}
IP: ${clientInfo.ip}

${messageTagVkMiniAppsActionUtils.getTagPlatform()} ${messageTagUtils.getTagComment(parameters.commentId, 'edit')} ${messageTagUtils.getTagNumber(parameters.number.number, parameters.number.numberId)} ${messageTagVkMiniAppsActionUtils.getTagUserAction(parameters.user.userId, clientInfo.vk_user_id)}`;
    }
  }

  private async getTextModerationComment(
    parameters: NumberCommentModeratedDto,
  ) {
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
      }) выполнил модерацию комментария с текстом: "${parameters.comment.text}"
    
Статус изменен с "${this.getTextCommentStatus(parameters.comment.prevStatus)}" на "${this.getTextCommentStatus(
        parameters.comment.status,
      )}"
      
Время: ${dateUtils.getDateFormatNumber(parameters.date)}
IP: ${clientInfo.ip}

${messageTagVkMiniAppsActionUtils.getTagPlatform()} ${messageTagUtils.getTagComment(parameters.comment.commentId, 'moderation')} ${messageTagUtils.getTagNumber(parameters.comment.number, parameters.comment.numberId)} ${messageTagVkMiniAppsActionUtils.getTagUserAction(parameters.user.userId, clientInfo.vk_user_id)}`;

      return text;
    }
  }

  getTextCommentStatus(status: NumberCommentStatus) {
    switch (status) {
      case NumberCommentStatus.PUBLISHED:
        return 'опубликован';
      case NumberCommentStatus.DECLINED:
        return 'отклонен';
      case NumberCommentStatus.MODERATION:
        return 'на модерации';
    }
  }

  getContentSource(appId: number = this.configService.get<number>('APP_ID')) {
    return JSON.stringify({
      type: 'url',
      url: `https://vk.com/app${appId}`,
    });
  }

  getKeyboardModerationComment(
    comment: { number: string; userId: number },
    appId: number,
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
