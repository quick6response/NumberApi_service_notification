import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitmqQueueConstant } from '@quick_response/number_api_event';
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
            urls: [
              {
                hostname: configService.get<string>('RABBITMQ_HOST'),
                port: configService.get<number>('RABBITMQ_PORT'),
                username: configService.get<string>('RABBITMQ_USER'),
                password: configService.get<string>('RABBITMQ_PASSWORD'),
              },
            ],
            // ручное подтверждение
            noAck: false,
            queueOptions: {
              durable: true,
            },
            queue: RabbitmqQueueConstant.mainServiceApi,
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule, RabbitmqApiMainService],
})
// главный апи по работе с клиентами
export class MainApiClientModule {}
