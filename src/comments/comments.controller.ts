import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RabbitmqNotificationKey } from '../common/rabbitmq/types/rabbitmq.notification.key.type';
import { CommentsService } from './comments.service';
import { CommentCreateDto } from './dto/comment.create.dto';
import { CommentDeleteDto } from './dto/comment.delete.dto';

const KEY_COMMENT_CREATE: RabbitmqNotificationKey = 'comment_create';
const KEY_COMMENT_DELETE: RabbitmqNotificationKey = 'comment_delete';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @MessagePattern(KEY_COMMENT_CREATE)
  async commentNew(@Payload() data: CommentCreateDto) {
    return this.commentsService.newComment(data);
  }

  @MessagePattern(KEY_COMMENT_DELETE)
  async commentDelete(@Payload() data: CommentDeleteDto) {
    return this.commentsService.deleteComment(data);
  }
}
