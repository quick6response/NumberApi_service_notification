import { Injectable } from '@nestjs/common';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';
import { VKChatsEnum } from '../common/config/vk.chats.config';
import { dateUtils } from '../common/utils/date.utils';
import { NumbersService } from '../numbers/numbers.service';
import { VkService } from '../vk/vk.service';
import { CommentsKeyboardService } from './comments.keyboard.service';
import { CommentCreateDto } from './dto/comment.create.dto';
import { CommentDeleteDto } from './dto/comment.delete.dto';
import { ModerationCommentDto } from './dto/moderation.comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
    private readonly numberService: NumbersService,
    private readonly vkHelpService: VkService,
    private readonly commentsKeyboardService: CommentsKeyboardService,
  ) {}

  async createComment(parameters: CommentCreateDto) {
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT,
      message: await this.getTextNewComment(parameters),
      random_id: getRandomId(),
      disable_mentions: true,
      keyboard: this.commentsKeyboardService.getCommentNew(
        parameters.vk_app_id,
      ),
      content_source: this.getContentSource(parameters.vk_app_id),
    });
    return { result: true };
  }

  private async getTextNewComment(parameters: CommentCreateDto) {
    const user = await this.vkHelpService.getInfoUserVk(parameters.vk_user_id);
    return `@id${user.id} (${user.first_name} ${
      user.last_name
    }) оставил комментарий №${
      parameters.commentId
    } на номер ${this.numberService.convertToFormat(
      parameters.number,
    )}\nТекст: ${parameters.text} (${
      parameters.isAnon ? 'Анонимный' : 'Обычный'
    })
    
Время: ${dateUtils.getDateFormatNumber(parameters.date)}
IP: ${parameters.ip}

#comment #comment_new_${parameters.commentId} #number${parameters.number} #id${
      parameters.vk_user_id
    }`;
  }

  async deleteComment(parameters: CommentDeleteDto) {
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT,
      message: await this.getTextDeleteComment(parameters),
      random_id: getRandomId(),
      disable_mentions: true,
      content_source: this.getContentSource(parameters.vk_app_id),
    });
    return { result: true };
  }

  private async getTextDeleteComment(parameters: CommentDeleteDto) {
    const user = await this.vkHelpService.getInfoUserVk(parameters.vk_user_id);
    return `@id${user.id} (${user.first_name} ${
      user.last_name
    }) удалил комментарий №${
      parameters.commentId
    } на номер ${this.numberService.convertToFormat(parameters.number)}
    
Время: ${dateUtils.getDateFormatNumber(parameters.date)}
IP: ${parameters.ip}

#comment #comment_delete_${parameters.commentId} #number${
      parameters.number
    } #id${parameters.vk_user_id}`;
  }

  async moderationCommentNumber(parameters: ModerationCommentDto) {
    const user = await this.vkHelpService.getInfoUserVk(
      parameters.infoUserAction.vk_user_id,
    );
    const text = `@id${user.id} (${user.first_name} ${
      user.last_name
    }) выполнил модерацию комментария с текстом: "${parameters.comment.text}"
    
Статус изменен с ${parameters.comment.prevStatus} на ${
      parameters.comment.status
    }
Время: ${dateUtils.getDateFormatNumber(parameters.date)}

#comment #comment_modetion #comment_id_${parameters.comment.commentId} #id${
      parameters.comment.userId
    }`;

    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT,
      message: text,
      random_id: getRandomId(),
      disable_mentions: true,
      content_source: this.getContentSource(
        parameters.infoUserAction.vk_app_id,
      ),
    });
    return { result: true };
  }

  private getContentSource(appId: number) {
    return JSON.stringify({
      type: 'url',
      url: `https://vk.com/app${appId}`,
    });
  }
}
