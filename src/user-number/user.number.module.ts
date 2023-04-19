import { Module } from '@nestjs/common';

import { VkHelpModule } from '../vk/vk.help.module';
import { UserNumberController } from './user.number.controller';
import { UserNumberService } from './user.number.service';

@Module({
  controllers: [UserNumberController],
  providers: [UserNumberService],
  imports: [VkHelpModule],
})
export class UserNumberModule {}
