import { Module } from '@nestjs/common';

import { RabbitmqModule } from './rabbitmq.module';
import { RabbitmqApiMainService } from './service/rabbitmq.api.main.service';

@Module({
  providers: [RabbitmqApiMainService],
  imports: [RabbitmqModule],
  exports: [RabbitmqApiMainService, RabbitmqModule],
})
export class MainApiClientModule {}
