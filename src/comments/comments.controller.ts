import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MicroservicesEventConstant } from '@quick_response/number_api_event';
import { RabbitmqNotificationEventsType } from '../common/rabbitmq/types/rabbitmq.notification.events.type';
import { CommentsService } from './comments.service';
import {
  VkCommentCreateDto,
  VkCommentDeleteDto,
  VkCommentEditDto,
} from './dto/vk.comment.dto';
import { VkModerationCommentDto } from './dto/vk.moderation.comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @EventPattern<RabbitmqNotificationEventsType>(
    MicroservicesEventConstant.notification.comment_create,
  )
  async commentCreate(@Payload() data: VkCommentCreateDto) {
    return await this.commentsService.commentCreate(data);
  }

  @EventPattern<RabbitmqNotificationEventsType>(
    MicroservicesEventConstant.notification.comment_delete,
  )
  async commentDelete(@Payload() data: VkCommentDeleteDto) {
    return await this.commentsService.commentDelete(data);
  }

  @EventPattern<RabbitmqNotificationEventsType>(
    MicroservicesEventConstant.notification.comment_edit,
  )
  async commentEdit(@Payload() data: VkCommentEditDto) {
    return await this.commentsService.commentEdit(data);
  }

  @EventPattern<RabbitmqNotificationEventsType>(
    MicroservicesEventConstant.notification.comment_moderation_number,
  )
  async moderationCommentNumber(@Payload() data: VkModerationCommentDto) {
    return await this.commentsService.moderationCommentNumber(data);
  }
}
