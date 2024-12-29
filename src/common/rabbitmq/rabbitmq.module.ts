import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitmqExchangesConstant } from '@numberapi/microservices';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        exchanges: [
          {
            name: RabbitmqExchangesConstant.vkPayment,
            type: 'direct',
          },
        ],
        uri: configService.get<string>('RABBITMQ_URL_CONNECT'),
      }),
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitmqModule {}
