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
    await this.commentsService.commentCreate(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey: MicroservicesEventConstant.notification.number_comment_delete,
  })
  async commentDelete(data: NumberCommentDeletedDto) {
    await this.commentsService.commentDelete(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey: MicroservicesEventConstant.notification.number_comment_edit,
  })
  async commentEdit(data: NumberCommentEditedDto) {
    await this.commentsService.commentEdit(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey:
      MicroservicesEventConstant.notification.number_comment_moderation,
  })
  async moderationCommentNumber(data: NumberCommentModeratedDto) {
    await this.commentsService.moderationCommentNumber(data);
  }
}
