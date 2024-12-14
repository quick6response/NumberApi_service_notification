import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  getQueueName,
  getRoutingKeyName,
  RabbitmqQueueConstant,
} from '@quick_response/number_api_event';

export function RabbitmqSubscribeNotificationService({
  exchange,
  routingKey,
}: {
  exchange: string;
  routingKey: string;
}): any {
  const routingKeyCreate = getRoutingKeyName(exchange, routingKey);
  const queueCreate = getQueueName(
    RabbitmqQueueConstant.notification,
    routingKey,
  );

  return RabbitSubscribe({
    exchange: exchange,
    routingKey: routingKeyCreate,
    queue: queueCreate,
  });
}
