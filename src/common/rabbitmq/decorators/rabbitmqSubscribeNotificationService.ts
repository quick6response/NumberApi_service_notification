import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  getQueueName,
  getRoutingKeyName,
  RabbitmqQueueConstant,
} from '@numberapi/microservices';

export function RabbitmqSubscribeNotificationService({
  exchange,
  routingKey,
}: {
  exchange: string;
  routingKey: string;
}) {
  const routingKeyStrGenerate = getRoutingKeyName(exchange, routingKey);
  const queueStrGenerate = getQueueName(
    RabbitmqQueueConstant.notification,
    routingKey,
  );

  return RabbitSubscribe({
    exchange: exchange,
    routingKey: routingKeyStrGenerate,
    queue: queueStrGenerate,
  });
}
