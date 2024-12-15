import { Module } from '@nestjs/common';

import { UserNumberNotificationRabbitmq } from './user.number.notification.rabbitmq';
import { UserNumberService } from './user.number.service';
import { RabbitmqModule } from '../common/rabbitmq/rabbitmq.module';
import { VkHelpModule } from '../vk/vk.help.module';

@Module({
  providers: [UserNumberService, UserNumberNotificationRabbitmq],
  imports: [VkHelpModule, RabbitmqModule],
})
export class UserNumberModule {}
