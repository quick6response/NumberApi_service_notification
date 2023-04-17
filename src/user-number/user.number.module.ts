import { Module } from '@nestjs/common';
import { RabbitmqModule } from '../common/rabbitmq/rabbitmq.module';
import { VkHelpModule } from '../vk/vk.help.module';
import { UserNumberController } from './user.number.controller';
import { UserNumberService } from './user.number.service';

@Module({
  controllers: [UserNumberController],
  providers: [UserNumberService],
  imports: [VkHelpModule, RabbitmqModule],
})
export class UserNumberModule {}
