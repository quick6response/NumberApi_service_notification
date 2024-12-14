import { Module } from '@nestjs/common';

import { RabbitmqModule } from 'src/common/rabbitmq/rabbitmq.module';

import { UsersNotificationRabbitmq } from './users.notification.rabbitmq';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, UsersNotificationRabbitmq],
  imports: [RabbitmqModule],
})
export class UsersModule {}
