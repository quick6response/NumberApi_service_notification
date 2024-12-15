import { Module } from '@nestjs/common';

import { OrganizationNotificationRabbitmq } from './organization.notification.rabbitmq';
import { OrganizationService } from './organization.service';
import { RabbitmqModule } from '../common/rabbitmq/rabbitmq.module';

@Module({
  providers: [OrganizationService, OrganizationNotificationRabbitmq],
  controllers: [],
  imports: [RabbitmqModule],
})
export class OrganizationModule {}
