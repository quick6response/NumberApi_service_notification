import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { VkModule } from 'nestjs-vk';
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
import config from './common/config/config';
import { RabbitmqModule } from './common/rabbitmq/rabbitmq.module';
import { DonutController } from './donut/donut.controller';
import { DonutModule } from './donut/donut.module';
import { DonutService } from './donut/donut.service';
import { DonutUpdate } from './donut/donut.update';
import { NumbersModule } from './numbers/numbers.module';
import { NumbersService } from './numbers/numbers.service';
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
      load: [config],
      envFilePath: `.env.${
        process.env.NODE_ENV !== 'production' ? 'dev' : 'prod'
      }`,
      isGlobal: true,
    }),
    RabbitmqModule,
    ClientsModule.registerAsync([
      {
        name: 'DONUT_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              {
                hostname: configService.get<string>('RABBIT_HOST'),
                port: configService.get<number>('RABBIT_PORT'),
                password: configService.get<string>('RABBIT_PASSWORD'),
                username: configService.get<string>('RABBIT_USER'),
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
  ],
})
export class AppModule {
  constructor() {
    console.log(process.env.NODE_ENV);
  }
}
