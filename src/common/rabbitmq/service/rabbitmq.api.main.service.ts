import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { RabbitmqExchangesConstant } from '@numberapi/microservices';
import {
  RabbitmqMainMessageKey,
  RabbitmqMainMessages,
} from '@numberapi/microservices/api';

@Injectable()
export class RabbitmqApiMainService {
  private readonly logger = new Logger(RabbitmqApiMainService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async emit<
    K extends RabbitmqMainMessageKey,
    V extends RabbitmqMainMessages[K],
  >(routingKey: K, message: V) {
    try {
      const data = {
        ...message,
        date: new Date().toString(),
      };
      const result = await this.amqpConnection.publish(
        RabbitmqExchangesConstant.notification,
        routingKey,
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
