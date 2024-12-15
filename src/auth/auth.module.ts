import { Module } from '@nestjs/common';

import { AuthNotificationRabbitmq } from './auth.notification.rabbitmq';
import { AuthService } from './auth.service';
import { RabbitmqModule } from '../common/rabbitmq/rabbitmq.module';
import { VkHelpModule } from '../vk/vk.help.module';

@Module({
  providers: [AuthService, AuthNotificationRabbitmq],
  controllers: [],
  imports: [VkHelpModule, RabbitmqModule],
})
export class AuthModule {}
