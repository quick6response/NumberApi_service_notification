import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { MainConstantEventName } from '@quick_response/number_api_event';
import { Ctx } from 'nestjs-vk';
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
  async commentCreate(
    @Payload() data: VkCommentCreateDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const call = await this.commentsService.commentCreate(data);

    if (call.result) {
      return channel.ack(originalMessage);
    }
  }

  @MessagePattern<RabbitmqNotificationEventsType>(
    MainConstantEventName.notification.comment_delete,
  )
  async commentDelete(
    @Payload() data: VkCommentDeleteDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const call = await this.commentsService.commentDelete(data);

    if (call.result) {
      return channel.ack(originalMessage);
    }
  }

  @MessagePattern<RabbitmqNotificationEventsType>(
    MainConstantEventName.notification.comment_edit,
  )
  async commentEdit(
    @Payload() data: VkCommentEditDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const call = await this.commentsService.commentEdit(data);

    if (call.result) {
      return channel.ack(originalMessage);
    }
  }

  @MessagePattern<RabbitmqNotificationEventsType>(
    MainConstantEventName.notification.comment_moderation_number,
  )
  async moderationCommentNumber(
    @Payload() data: VkModerationCommentDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const call = await this.commentsService.moderationCommentNumber(data);

    if (call.result) {
      return channel.ack(originalMessage);
    }
  }
}
