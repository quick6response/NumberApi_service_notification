import { Module } from '@nestjs/common';
import { MainApiClientModule } from '../common/rabbitmq/main.api.client.module';
import { VkHelpModule } from '../vk/vk.help.module';
import { DonutController } from './donut.controller';
import { DonutUpdate } from './donut.update';
import { DonutNotificationService } from './service/donut.notification.service';
import { DonutVkService } from './service/donut.vk.service';

@Module({
  controllers: [DonutController],
  providers: [DonutNotificationService, DonutVkService, DonutUpdate],
  imports: [VkHelpModule, MainApiClientModule],
})
export class DonutModule {}
