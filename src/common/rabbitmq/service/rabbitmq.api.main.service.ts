import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import {
  getRoutingKeyName,
  RabbitmqExchangesConstant,
} from '@numberapi/microservices';
import {
  RabbitmqServiceApiEventsKeys,
  RabbitmqServiceApiEventsDtoData,
} from '@numberapi/microservices/api';

@Injectable()
export class RabbitmqApiMainService {
  private readonly logger = new Logger(RabbitmqApiMainService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async emit<
    K extends RabbitmqServiceApiEventsKeys,
    V extends RabbitmqServiceApiEventsDtoData[K],
  >(routingKey: K, message: V) {
    try {
      const data = {
        ...message,
        date: new Date().toString(),
      };
      const routingKeyCreate = getRoutingKeyName(
        RabbitmqExchangesConstant.notification,
        routingKey,
      );
      const result = await this.amqpConnection.publish(
        RabbitmqExchangesConstant.notification,
        routingKeyCreate,
        data,
      );

      return result;
    } catch (error) {
      this.logger.error({
        err: error,
        extra: {
          routingKey,
          message,
        },
      });
    }
  }
}
