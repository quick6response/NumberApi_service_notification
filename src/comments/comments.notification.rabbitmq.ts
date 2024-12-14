import { Injectable } from '@nestjs/common';
import {
  MicroservicesEventConstant,
  RabbitmqExchangesConstant,
} from '@quick_response/number_api_event';

import { CommentsService } from './comments.service';
import {
  VkCommentCreateDto,
  VkCommentDeleteDto,
  VkCommentEditDto,
} from './dto/vk.comment.dto';
import { VkModerationCommentDto } from './dto/vk.moderation.comment.dto';
import { RabbitmqSubscribeNotificationService } from '../common/rabbitmq/decorators/rabbitmqSubscribeNotificationService';

@Injectable()
export class CommentsNotificationRabbitmq {
  constructor(private readonly commentsService: CommentsService) {}

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey: MicroservicesEventConstant.notification.comment_create,
  })
  public async commentCreate(data: VkCommentCreateDto) {
    return await this.commentsService.commentCreate(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey: MicroservicesEventConstant.notification.comment_delete,
  })
  async commentDelete(data: VkCommentDeleteDto) {
    return await this.commentsService.commentDelete(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey: MicroservicesEventConstant.notification.comment_edit,
  })
  async commentEdit(data: VkCommentEditDto) {
    return await this.commentsService.commentEdit(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey:
      MicroservicesEventConstant.notification.comment_moderation_number,
  })
  async moderationCommentNumber(data: VkModerationCommentDto) {
    return await this.commentsService.moderationCommentNumber(data);
  }
}
