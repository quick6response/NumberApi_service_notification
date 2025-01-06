import { Module } from '@nestjs/common';

import { RabbitmqModule } from './rabbitmq.module';
import { RabbitmqApiMainService } from './service/rabbitmq.api.main.service';
import { RabbitmqVkPaymentService } from './service/rabbitmq.vk.payment.service';

@Module({
  providers: [RabbitmqApiMainService, RabbitmqVkPaymentService],
  imports: [RabbitmqModule],
  exports: [RabbitmqApiMainService, RabbitmqModule, RabbitmqVkPaymentService],
})
export class MainApiClientModule {}
