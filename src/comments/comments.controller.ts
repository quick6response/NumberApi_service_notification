import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MainConstantEventName } from '@quick_response/number_api_event/dist/_types';
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

  @MessagePattern<RabbitmqNotificationEventsType>(
    MainConstantEventName.notification.comment_create,
  )
  async commentCreate(@Payload() data: VkCommentCreateDto) {
    return this.commentsService.commentCreate(data);
  }

  @MessagePattern<RabbitmqNotificationEventsType>(
    MainConstantEventName.notification.comment_delete,
  )
  async commentDelete(@Payload() data: VkCommentDeleteDto) {
    return this.commentsService.commentDelete(data);
  }

  @MessagePattern<RabbitmqNotificationEventsType>(
    MainConstantEventName.notification.comment_edit,
  )
  async commentEdit(@Payload() data: VkCommentEditDto) {
    return this.commentsService.commentEdit(data);
  }

  @MessagePattern<RabbitmqNotificationEventsType>(
    MainConstantEventName.notification.comment_moderation_number,
  )
  async moderationCommentNumber(@Payload() data: VkModerationCommentDto) {
    await this.commentsService.moderationCommentNumber(data);
  }
}
