import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Ctx } from 'nestjs-vk';
import { RabbitmqNotificationKey } from '../common/rabbitmq/types/rabbitmq.notification.key.type';
import { CommentsService } from './comments.service';
import { CommentCreateDto } from './dto/comment.create.dto';
import { CommentDeleteDto } from './dto/comment.delete.dto';
import { ModerationCommentDto } from './dto/moderation.comment.dto';

const KEY_COMMENT_CREATE: RabbitmqNotificationKey = 'comment_create';
const KEY_COMMENT_DELETE: RabbitmqNotificationKey = 'comment_delete';

@Controller('comments')
export class CommentsController {
  private processedMessageIds: Record<string, boolean> = {};
  constructor(private readonly commentsService: CommentsService) {}
  @MessagePattern(KEY_COMMENT_CREATE)
  async commentCreate(@Payload() data: CommentCreateDto) {
    return this.commentsService.createComment(data);
  }

  @MessagePattern(KEY_COMMENT_DELETE)
  async commentDelete(@Payload() data: CommentDeleteDto) {
    return this.commentsService.deleteComment(data);
  }

  @MessagePattern<RabbitmqNotificationKey>('moderation_comment_number')
  async moderationCommentNumber(
    @Payload() data: ModerationCommentDto,
    @Ctx() context: RmqContext,
  ) {
    await this.commentsService.moderationCommentNumber(data);
  }
}
