import { Injectable } from '@nestjs/common';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, Keyboard, VK } from 'vk-io';
import { VKChatsEnum } from '../common/config/vk.chats.config';
import { dateUtils } from '../common/utils/date.utils';
import { messageTagVkMiniAppsActionUtils } from '../common/utils/message.tag.utils';
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
  ) {}

  async commentCreate(parameters: VkCommentCreateDto) {
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT_DEV,
      message: await this.getTextCommentCreate(parameters),
      random_id: getRandomId(),
      disable_mentions: true,
      keyboard: this.getKeyboardModerationComment(
        parameters.vk_app_id,
        parameters.comment.number,
        parameters.comment.userId,
      ),
      content_source: this.getContentSource(parameters.vk_app_id),
    });
    return { result: true };
  }

  async commentDelete(parameters: VkCommentDeleteDto) {
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT_DEV,
      message: await this.getTextCommentDelete(parameters),
      random_id: getRandomId(),
      disable_mentions: true,
      content_source: this.getContentSource(parameters.vk_app_id),
    });
    return { result: true };
  }

  async commentEdit(parameters: VkCommentEditDto) {
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT_DEV,
      message: await this.getTextCommentEdit(parameters),
      random_id: getRandomId(),
      disable_mentions: true,
      content_source: this.getContentSource(parameters.vk_app_id),
    });
    return { result: true };
  }

  async moderationCommentNumber(parameters: VkModerationCommentDto) {
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT_DEV,
      message: await this.getTextModerationComment(parameters),
      random_id: getRandomId(),
      disable_mentions: true,
      content_source: this.getContentSource(parameters.vk_app_id),
    });
    return { result: true };
  }

  private async getTextCommentCreate(parameters: VkCommentCreateDto) {
    const user = await this.vkHelpService.getInfoUserVk(parameters.vk_user_id);
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
IP: ${parameters.ip}

${messageTagVkMiniAppsActionUtils.getTagComment(parameters.comment.commentId, 'create')} ${messageTagVkMiniAppsActionUtils.getTagNumber(parameters.comment.number, parameters.comment.numberId)} ${messageTagVkMiniAppsActionUtils.getTagUserAction(parameters.comment.userId, parameters.vk_user_id)}`;
  }

  private async getTextCommentDelete(parameters: VkCommentDeleteDto) {
    const user = await this.vkHelpService.getInfoUserVk(parameters.vk_user_id);
    return `@id${user.id} (${user.first_name} ${
      user.last_name
    }) удалил комментарий №${
      parameters.comment.commentId
    } на номер ${this.numberService.convertToFormat(parameters.comment.number)}
    
Время: ${dateUtils.getDateFormatNumber(parameters.date)}
IP: ${parameters.ip}

${messageTagVkMiniAppsActionUtils.getTagComment(parameters.comment.commentId, 'delete')} ${messageTagVkMiniAppsActionUtils.getTagNumber(parameters.comment.number, parameters.comment.numberId)} ${messageTagVkMiniAppsActionUtils.getTagUserAction(parameters.comment.userId, parameters.vk_user_id)}`;
  }

  private async getTextCommentEdit(parameters: VkCommentEditDto) {
    const user = await this.vkHelpService.getInfoUserVk(parameters.vk_user_id);
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
IP: ${parameters.ip}

${messageTagVkMiniAppsActionUtils.getTagComment(parameters.nextComment.commentId, 'edit')} ${messageTagVkMiniAppsActionUtils.getTagNumber(parameters.nextComment.number, parameters.nextComment.numberId)} ${messageTagVkMiniAppsActionUtils.getTagUserAction(parameters.nextComment.userId, parameters.vk_user_id)}`;
  }

  private async getTextModerationComment(parameters: VkModerationCommentDto) {
    const user = await this.vkHelpService.getInfoUserVk(parameters.vk_user_id);
    const text = `@id${user.id} (${user.first_name} ${
      user.last_name
    }) (Роль ${parameters.userInfo.role}) выполнил модерацию комментария с текстом: "${parameters.comment.text}"
    
Статус изменен с "${parameters.comment.prevStatus}" на "${
      parameters.comment.status
    }"\n
Время: ${dateUtils.getDateFormatNumber(parameters.date)}
IP: ${parameters.ip}

${messageTagVkMiniAppsActionUtils.getTagComment(parameters.comment.commentId, 'moderation')} ${messageTagVkMiniAppsActionUtils.getTagNumber(parameters.comment.number, parameters.comment.numberId)} ${messageTagVkMiniAppsActionUtils.getTagUserAction(parameters.userInfo.id, parameters.userInfo.vkId)}`;

    return text;
  }

  private getContentSource(appId: number) {
    return JSON.stringify({
      type: 'url',
      url: `https://vk.com/app${appId}`,
    });
  }

  getKeyboardModerationComment(appId: number, number: string, userId: number) {
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
          hash: `number/?number=${number}`,
          appId: appId,
        }),
      ],
      [
        Keyboard.applicationButton({
          label: 'Информация о пользователе',
          hash: `user/info?userId=${userId}`,
          appId: appId,
        }),
      ],
    ]).inline();
    return builder;
  }
}
