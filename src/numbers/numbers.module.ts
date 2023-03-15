import { Module } from '@nestjs/common';
import { VkHelpModule } from '../vk/vk.help.module';
import { NumbersController } from './numbers.controller';
import { NumbersService } from './numbers.service';

@Module({
  controllers: [NumbersController],
  providers: [NumbersService],
  imports: [VkHelpModule],
})
export class NumbersModule {}
