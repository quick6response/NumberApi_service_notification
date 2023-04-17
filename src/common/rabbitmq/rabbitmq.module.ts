import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [{ name: 'events', type: 'topic' }],
        uri: `amqp://${configService.get<string>(
          'RABBIT_USER',
        )}:${configService.get<string>(
          'RABBIT_PASSWORD',
        )}@${configService.get<string>(
          'RABBIT_HOST',
        )}:${configService.get<number>('RABBIT_PORT')}`,
        connectionName: 'rabbitmq-server',
        connectionInitOptions: { wait: false },
      }),
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitmqModule {}
