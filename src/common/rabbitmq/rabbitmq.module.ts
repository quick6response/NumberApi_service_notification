import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitmqExchangesConstant } from '@numberapi/microservices';

class LoggerCustom extends Logger {
  constructor() {
    super();
  }

  log(msg: string, context?: string) {
    super.debug(msg, context);
  }
}

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
        logger: new LoggerCustom(),
        uri: configService.get<string>('RABBITMQ_URL_CONNECT'),
      }),
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitmqModule {}
