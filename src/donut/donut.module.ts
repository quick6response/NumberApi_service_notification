import { Module } from '@nestjs/common';

import { DonutNotificationRabbitmq } from './donut.notification.rabbitmq';
import { DonutUpdate } from './donut.update';
import { DonutNotificationService } from './service/donut.notification.service';
import { DonutVkService } from './service/donut.vk.service';
import { MainApiClientModule } from '../common/rabbitmq/main.api.client.module';
import { RabbitmqModule } from '../common/rabbitmq/rabbitmq.module';
import { VkHelpModule } from '../vk/vk.help.module';

@Module({
  controllers: [],
  providers: [
    DonutNotificationService,
    DonutVkService,
    DonutUpdate,
    DonutNotificationRabbitmq,
  ],
  imports: [VkHelpModule, MainApiClientModule, RabbitmqModule],
})
export class DonutModule {}
