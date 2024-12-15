import { Module } from '@nestjs/common';

import { ServerNotificationRabbitmq } from './server.notification.rabbitmq';
import { ServerNotificationService } from './server.notification.service';
import { RabbitmqModule } from '../common/rabbitmq/rabbitmq.module';

@Module({
  providers: [ServerNotificationService, ServerNotificationRabbitmq],
  controllers: [],
  imports: [RabbitmqModule],
})
export class ServerModule {}
