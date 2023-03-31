import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { VkModule } from 'nestjs-vk';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { CacheModule } from './common/cache/cache.module';
import config from './common/config/config';
import { DonutController } from './donut/donut.controller';
import { DonutModule } from './donut/donut.module';
import { DonutService } from './donut/donut.service';
import { DonutUpdate } from './donut/donut.update';
import { NumbersModule } from './numbers/numbers.module';
import { NumbersService } from './numbers/numbers.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { VkHelpModule } from './vk/vk.help.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      load: [config],
      envFilePath: `.env.${
        process.env.NODE_ENV !== 'production' ? 'dev' : 'prod'
      }`,
      isGlobal: true,
    }),
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
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    DonutController,
  ],
  providers: [
    AppService,
    UsersService,
    AuthService,
    NumbersService,
    DonutService,
    DonutUpdate,
  ],
})
export class AppModule {
  constructor() {
    console.log(process.env.NODE_ENV);
  }
}
