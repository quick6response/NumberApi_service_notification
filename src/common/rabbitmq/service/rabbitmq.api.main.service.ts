import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { RabbitmqExchangesConstant } from '@quick_response/number_api_event';
import { RabbitmqMainMessageKey } from '@quick_response/number_api_event/dist/_types';
import { RabbitmqMainMessages } from '@quick_response/number_api_event/dist/microservice/main/types/rabbitmq.events.data.type';

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
