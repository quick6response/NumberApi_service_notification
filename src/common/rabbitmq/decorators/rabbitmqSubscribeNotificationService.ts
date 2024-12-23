import {
  MessageHandlerOptions,
  RabbitHandlerConfig,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { getQueueName, RabbitmqQueueConstant } from '@numberapi/microservices';

export function RabbitmqSubscribeNotificationService({
  exchange,
  routingKey,
  queueOptions = {},
  errorHandler,
  batchOptions,
}: {
  exchange: string;
  routingKey: string;
  queueOptions?: RabbitHandlerConfig['queueOptions'];
  errorHandler?: RabbitHandlerConfig['errorHandler'];
  batchOptions?: MessageHandlerOptions['batchOptions'];
}) {
  const queueStrGenerate = getQueueName(
    RabbitmqQueueConstant.notification,
    routingKey,
  );

  return RabbitSubscribe({
    exchange: exchange,
    routingKey: routingKey,
    queue: queueStrGenerate,
    queueOptions,
    errorHandler,
    batchOptions,
  });
}
