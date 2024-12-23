import { Injectable, Logger } from '@nestjs/common';
import {
  MicroservicesEventConstant,
  RabbitmqExchangesConstant,
} from '@numberapi/microservices';

import { DonutUserEventDto } from './dto/donut.user.event.dto';
import { DonutNotificationService } from './service/donut.notification.service';
import { RabbitmqSubscribeNotificationService } from '../common/rabbitmq/decorators/rabbitmqSubscribeNotificationService';

@Injectable()
export class DonutNotificationRabbitmq {
  private readonly logger = new Logger(DonutNotificationRabbitmq.name);

  constructor(private readonly donutService: DonutNotificationService) {}

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey:
      MicroservicesEventConstant.notification.donut_subscriptionIssuance,
    queueOptions: {
      durable: true,
      autoDelete: false,
      deadLetterExchange: RabbitmqExchangesConstant.mainServiceApi,
      deadLetterRoutingKey: `${MicroservicesEventConstant.notification.donut_subscriptionIssuance}.retry`,
    },
  })
  async subscriptionIssuance(data: DonutUserEventDto) {
    try {
      await this.donutService.subscriptionIssuance(data);
    } catch (err) {
      this.logger.error({ err, extra: { data } });
      throw err;
    }
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey:
      MicroservicesEventConstant.notification.donut_subscriptionExpired,
    queueOptions: {
      durable: true,
      autoDelete: false,
      deadLetterExchange: RabbitmqExchangesConstant.mainServiceApi,
      deadLetterRoutingKey: `${MicroservicesEventConstant.notification.donut_subscriptionExpired}.retry`,
    },
  })
  async subscriptionExpired(data: DonutUserEventDto) {
    try {
      await this.donutService.subscriptionExpired(data);
    } catch (err) {
      this.logger.error({ err, extra: { data } });
      throw err;
    }
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey:
      MicroservicesEventConstant.notification.donut_subscriptionProlonged,
    queueOptions: {
      durable: true,
      autoDelete: false,
      deadLetterExchange: RabbitmqExchangesConstant.mainServiceApi,
      deadLetterRoutingKey: `${MicroservicesEventConstant.notification.donut_subscriptionProlonged}.retry`,
    },
  })
  async subscriptionProlonged(data: DonutUserEventDto) {
    try {
      await this.donutService.subscriptionProlonged(data);
    } catch (err) {
      this.logger.error({ err, extra: { data } });
      throw err;
    }
  }
}
