import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VkModule } from 'nestjs-vk';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { CacheModule } from './common/cache/cache.module';
import config from './common/config/config';
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
      envFilePath: ['.env', '.env.local'],
      isGlobal: true,
    }),
    VkModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('VK_GROUP_TOKEN'),
        options: {
          pollingGroupId: +configService.get('VK_GROUP_ID'),
          apiMode: 'parallel_selected',
        },
      }),
      imports: [ConfigModule],
    }),
    CacheModule,
    NumbersModule,
    VkHelpModule,
  ],
  controllers: [AppController, AuthController, UsersController],
  providers: [AppService, UsersService, AuthService, NumbersService],
})
export class AppModule {}
