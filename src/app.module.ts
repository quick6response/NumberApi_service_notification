import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectVkApi, VkModule } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';

import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { CacheModule } from './common/cache/cache.module';
import { VKChatsEnum } from './common/config/vk.chats.config';
import { LoggerModule } from './common/logger/logger.module';
import { FeaturesMiddleware } from './common/middleware/features.middleware';
import { MainMiddleware } from './common/middleware/main.middleware';
import { MainApiClientModule } from './common/rabbitmq/main.api.client.module';
import { RabbitmqModule } from './common/rabbitmq/rabbitmq.module';
import { RabbitmqApiMainService } from './common/rabbitmq/service/rabbitmq.api.main.service';
import { dateUtils } from './common/utils/date.utils';
import { DonutModule } from './donut/donut.module';
import { NumbersModule } from './numbers/numbers.module';
import { OperatorsModule } from './operators/operators.module';
import { OrganizationModule } from './organization/organization.module';
import { ServerModule } from './server/server.module';
import { UserNumberModule } from './user-number/user.number.module';
import { UsersModule } from './users/users.module';
import { VkHelpModule } from './vk/vk.help.module';

@Module({
  controllers: [],
  providers: [
    MainMiddleware,
    AppService,
    RabbitmqApiMainService,
    FeaturesMiddleware,
  ],
  imports: [
    UsersModule,
    AuthModule,
    UserNumberModule,
    CacheModule,
    NumbersModule,
    VkHelpModule,
    DonutModule,
    CommentsModule,
    OperatorsModule,
    ServerModule,
    MainApiClientModule,
    OrganizationModule,
    RabbitmqModule,
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
      cache: true,
    }),
    VkModule.forManagers({
      useSessionManager: false,
      useSceneManager: false,
      useHearManager: true,
    }),
    VkModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('VK_GROUP_TOKEN'),
        options: {
          pollingGroupId: +configService.get('VK_GROUP_ID'),
          apiMode: 'sequential',
          apiVersion: '5.131',
          apiParams: {
            v: '5.131',
            lang: 'ru',
          },
        },
        include: [DonutModule],
        notReplyMessage: false,
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    LoggerModule,
  ],
  exports: [FeaturesMiddleware],
})
export class AppModule {
  constructor(@InjectVkApi() private readonly vk: VK) {
    this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT_DEV,
      message: `Запущен обработчик уведомлений!\n
Время: ${dateUtils.getDateFormatNumber(
        new Date().toISOString(),
      )}\n\n#notification #notification_start`,
      random_id: getRandomId(),
    });
  }
}
