import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InjectVkApi, VkModule } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { CommentsController } from './comments/comments.controller';
import { CommentsKeyboardService } from './comments/comments.keyboard.service';
import { CommentsModule } from './comments/comments.module';
import { CommentsService } from './comments/comments.service';
import { CacheModule } from './common/cache/cache.module';
import { VKChatsEnum } from './common/config/vk.chats.config';
import { rabbitNameConfig } from './common/rabbitmq/config/rabbit.name.config';
import { rabbitQueueConfig } from './common/rabbitmq/config/rabbitmq.queue.config';
import { dateUtils } from './common/utils/date.utils';
import { DonutController } from './donut/donut.controller';
import { DonutModule } from './donut/donut.module';
import { DonutService } from './donut/donut.service';
import { DonutUpdate } from './donut/donut.update';
import { NumbersModule } from './numbers/numbers.module';
import { NumbersService } from './numbers/numbers.service';
import { OperatorsModule } from './operators/operators.module';
import { ServerModule } from './server/server.module';
import { UserNumberController } from './user-number/user.number.controller';
import { UserNumberModule } from './user-number/user.number.module';
import { UserNumberService } from './user-number/user.number.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { VkHelpModule } from './vk/vk.help.module';

@Module({
  controllers: [
    AppController,
    AuthController,
    UsersController,
    DonutController,
    CommentsController,
    UserNumberController,
  ],
  providers: [
    AppService,
    UsersService,
    AuthService,
    NumbersService,
    DonutService,
    DonutUpdate,
    CommentsService,
    CommentsKeyboardService,
    UserNumberService,
  ],

  imports: [
    UsersModule,
    AuthModule,
    UserNumberModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
      cache: true,
    }),
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
                password: configService.get<string>('RABBITMQ_PASSWORD'),
                username: configService.get<string>('RABBITMQ_USER'),
              },
            ],
            queueOptions: {
              durable: true,
            },
            queue: rabbitQueueConfig.NAME_NUMBER_API_QUEUE,
          },
        }),
      },
    ]),
    VkModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('VK_GROUP_TOKEN'),
        options: {
          pollingGroupId: +configService.get('VK_GROUP_ID'),
          apiMode: 'sequential',
        },
      }),
      imports: [ConfigModule, DonutModule],
    }),
    CacheModule,
    NumbersModule,
    VkHelpModule,
    DonutModule,
    CommentsModule,
    OperatorsModule,
    ServerModule,
  ],
})
export class AppModule {
  constructor(@InjectVkApi() private readonly vk: VK) {
    this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT,
      message: `Запущен обработчик уведомлений!\n
Время: ${dateUtils.getDateFormatNumber(
        new Date().toISOString(),
      )}\n\n#notification #notification_start`,
      random_id: getRandomId(),
    });
  }
}
