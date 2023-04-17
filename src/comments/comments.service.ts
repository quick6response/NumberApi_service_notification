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

@Injectable()
export class CommentsService {
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
    private readonly numberService: NumbersService,
    private readonly vkHelpService: VkService,
    private readonly commentsKeyboardService: CommentsKeyboardService,
  ) {}

  async newComment(parameters: CommentCreateDto) {
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT,
      message: await this.getTextNewComment(parameters),
      random_id: getRandomId(),
      disable_mentions: true,
      keyboard: this.commentsKeyboardService.getCommentNew(),
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
}
