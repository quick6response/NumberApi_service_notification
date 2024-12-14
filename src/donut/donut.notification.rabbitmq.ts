import { Injectable } from '@nestjs/common';
import {
  MicroservicesEventConstant,
  RabbitmqExchangesConstant,
} from '@quick_response/number_api_event';

import { DonutUserEventDto } from './dto/donut.user.event.dto';
import { DonutNotificationService } from './service/donut.notification.service';
import { RabbitmqSubscribeNotificationService } from '../common/rabbitmq/decorators/rabbitmqSubscribeNotificationService';

@Injectable()
export class DonutNotificationRabbitmq {
  constructor(private readonly donutService: DonutNotificationService) {}

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey:
      MicroservicesEventConstant.notification.donut_subscriptionIssuance,
  })
  async subscriptionIssuance(data: DonutUserEventDto) {
    return await this.donutService.subscriptionIssuance(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey:
      MicroservicesEventConstant.notification.donut_subscriptionExpired,
  })
  async subscriptionExpired(data: DonutUserEventDto) {
    return await this.donutService.subscriptionExpired(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey:
      MicroservicesEventConstant.notification.donut_subscriptionProlonged,
  })
  async subscriptionProlonged(data: DonutUserEventDto) {
    return await this.donutService.subscriptionProlonged(data);
  }
}
