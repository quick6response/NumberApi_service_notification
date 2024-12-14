import { Module } from '@nestjs/common';

import { NumbersNotificationRabbitmq } from './numbers.notification.rabbitmq';
import { NumbersService } from './numbers.service';
import { RabbitmqModule } from '../common/rabbitmq/rabbitmq.module';
import { VkHelpModule } from '../vk/vk.help.module';

@Module({
  controllers: [],
  providers: [NumbersService, NumbersNotificationRabbitmq],
  exports: [NumbersService],
  imports: [VkHelpModule, RabbitmqModule],
})
export class NumbersModule {}
