import { Injectable } from '@nestjs/common';
import {
  MicroservicesEventConstant,
  RabbitmqExchangesConstant,
} from 'numberapi/microservice';
import {
  NumberCommentCreatedDto,
  NumberCommentDeletedDto,
  NumberCommentEditedDto,
  NumberCommentModeratedDto,
} from 'numberapi/microservice/notification';

import { CommentsService } from './comments.service';
import { RabbitmqSubscribeNotificationService } from '../common/rabbitmq/decorators/rabbitmqSubscribeNotificationService';

@Injectable()
export class CommentsNotificationRabbitmq {
  constructor(private readonly commentsService: CommentsService) {}

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey: MicroservicesEventConstant.notification.number_comment_create,
  })
  public async commentCreate(data: NumberCommentCreatedDto) {
    return await this.commentsService.commentCreate(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey: MicroservicesEventConstant.notification.number_comment_delete,
  })
  async commentDelete(data: NumberCommentDeletedDto) {
    return await this.commentsService.commentDelete(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey: MicroservicesEventConstant.notification.number_comment_edit,
  })
  async commentEdit(data: NumberCommentEditedDto) {
    return await this.commentsService.commentEdit(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey:
      MicroservicesEventConstant.notification.number_comment_moderation_number,
  })
  async moderationCommentNumber(data: NumberCommentModeratedDto) {
    return await this.commentsService.moderationCommentNumber(data);
  }
}
