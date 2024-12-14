import { Module } from '@nestjs/common';

import { RabbitmqModule } from 'src/common/rabbitmq/rabbitmq.module';

import { OperatorsNotificationRabbitmq } from './operators.notification.rabbitmq';
import { OperatorsService } from './operators.service';

@Module({
  providers: [OperatorsService, OperatorsNotificationRabbitmq],
  imports: [RabbitmqModule],
})
export class OperatorsModule {}
