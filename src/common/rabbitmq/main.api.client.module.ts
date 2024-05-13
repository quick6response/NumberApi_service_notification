import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitmqQueueConfig } from '@quick_response/number_api_event';
import { rabbitNameConfig } from './config/rabbit.name.config';
import { RabbitmqApiMainService } from './service/rabbitmq.api.main.service';

@Module({
  providers: [RabbitmqApiMainService],
  imports: [
    ClientsModule.registerAsync([
      {
        name: rabbitNameConfig.SERVICE_API,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            noAssert: true,
            urls: [
              {
                hostname: configService.get<string>('RABBITMQ_HOST'),
                port: configService.get<number>('RABBITMQ_PORT'),
                password: configService.get<string>('RABBITMQ_DEFAULT_PASS'),
                username: configService.get<string>('RABBITMQ_DEFAULT_USER'),
              },
            ],
            // руками подтверждаем
            noAck: false,
            queueOptions: {
              durable: true,
            },
            queue: RabbitmqQueueConfig.mainServiceApi,
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule, RabbitmqApiMainService],
})
// главный апи по работе с клиентами
export class MainApiClientModule {}
