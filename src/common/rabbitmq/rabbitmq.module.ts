import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  RabbitmqExchangesConstant,
  RabbitmqQueueConstant,
} from '@quick_response/number_api_event';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        exchanges: [
          {
            name: RabbitmqExchangesConstant.notification,
            type: 'direct',
          },
        ],
        queues: [
          {
            name: RabbitmqQueueConstant.notification,
            exchange: RabbitmqQueueConstant.notification,
          },
        ],
        uri: configService.get<string>('RABBITMQ_URL_CONNECT'),
      }),
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitmqModule {}
