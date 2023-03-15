import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { VkHelpModule } from '../vk/vk.help.module';
import { DonutController } from './donut.controller';
import { DonutService } from './donut.service';
import { DonutUpdate } from './donut.update';

@Module({
  controllers: [DonutUpdate, DonutController],
  providers: [DonutService],
  imports: [
    VkHelpModule,
    ClientsModule.registerAsync([
      {
        name: 'DONUT_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              {
                hostname: configService.get<string>('RABBITMQ_HOST'),
                port: configService.get<number>('RABBITMQ_PORT'),
                password: configService.get<string>('RABBITMQ_DEFAULT_PASS'),
                username: configService.get<string>('RABBITMQ_DEFAULT_USER'),
              },
            ],
            queueOptions: {
              durable: true,
            },
            queue: 'vk_donut_queue',
          },
        }),
      },
    ]),
  ],
})
export class DonutModule {}
