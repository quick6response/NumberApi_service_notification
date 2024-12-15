import { Module } from '@nestjs/common';

import { CommentsNotificationRabbitmq } from './comments.notification.rabbitmq';
import { CommentsService } from './comments.service';
import { RabbitmqModule } from '../common/rabbitmq/rabbitmq.module';
import { NumbersModule } from '../numbers/numbers.module';
import { VkHelpModule } from '../vk/vk.help.module';

@Module({
  providers: [CommentsService, CommentsNotificationRabbitmq],
  imports: [VkHelpModule, NumbersModule, RabbitmqModule],
})
export class CommentsModule {}
