import { Injectable } from '@nestjs/common';
import {
  MicroservicesEventConstant,
  RabbitmqExchangesConstant,
} from 'numberapi/microservice';

import { UserNumberNotificationDto } from './dto/user.number.notification.dto';
import { UserNumberService } from './user.number.service';
import { RabbitmqSubscribeNotificationService } from '../common/rabbitmq/decorators/rabbitmqSubscribeNotificationService';

@Injectable()
export class UserNumberNotificationRabbitmq {
  constructor(private readonly userNumberService: UserNumberService) {}

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey:
      MicroservicesEventConstant.notification.user_another_number_find,
  })
  async notificationNumberFind(data: UserNumberNotificationDto) {
    return this.userNumberService.notificationFindNumber(data);
  }
}
