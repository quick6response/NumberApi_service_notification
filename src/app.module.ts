import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectVkApi, VkModule } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { CommentsModule } from './comments/comments.module';
import { CommentsService } from './comments/comments.service';
import { CacheModule } from './common/cache/cache.module';
import { VKChatsEnum } from './common/config/vk.chats.config';
import { MainApiClientModule } from './common/rabbitmq/main.api.client.module';
import { RabbitmqApiMainService } from './common/rabbitmq/service/rabbitmq.api.main.service';
import { dateUtils } from './common/utils/date.utils';
import { DonutModule } from './donut/donut.module';
import { DonutService } from './donut/donut.service';
import { DonutUpdate } from './donut/donut.update';
import { MainMiddleware } from './main.middleware';
import { NumbersModule } from './numbers/numbers.module';
import { NumbersService } from './numbers/numbers.service';
import { OperatorsModule } from './operators/operators.module';
import { OrganizationModule } from './organization/organization.module';
import { ServerModule } from './server/server.module';
import { UserNumberModule } from './user-number/user.number.module';
import { UserNumberService } from './user-number/user.number.service';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { VkHelpModule } from './vk/vk.help.module';

@Module({
  controllers: [],
  providers: [
    MainMiddleware,
    AppService,
    UsersService,
    AuthService,
    NumbersService,
    DonutService,
    DonutUpdate,
    CommentsService,
    UserNumberService,
    RabbitmqApiMainService,
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
    MainApiClientModule,
    VkModule.forManagers({
      useSessionManager: true,
      useSceneManager: true,
      useHearManager: true,
    }),
    VkModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('VK_GROUP_TOKEN'),
        options: {
          pollingGroupId: +configService.get('VK_GROUP_ID'),
          apiMode: 'sequential',
        },

        notReplyMessage: false,
        // middlewaresBefore: [mainMiddleware.middlewaresBefore],
        // middlewaresAfter: [mainMiddleware.middlewaresAfter],
      }),
      imports: [ConfigModule],
    }),
    CacheModule,
    NumbersModule,
    VkHelpModule,
    DonutModule,
    CommentsModule,
    OperatorsModule,
    ServerModule,
    MainApiClientModule,
    OrganizationModule,
  ],
  exports: [MainMiddleware, VkModule],
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
