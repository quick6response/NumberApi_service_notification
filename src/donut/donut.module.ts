import { Module } from '@nestjs/common';
import { MainApiClientModule } from '../common/rabbitmq/main.api.client.module';
import { VkHelpModule } from '../vk/vk.help.module';
import { DonutController } from './donut.controller';
import { DonutService } from './donut.service';
import { DonutUpdate } from './donut.update';

@Module({
  controllers: [DonutUpdate, DonutController],
  providers: [DonutService],
  imports: [VkHelpModule, MainApiClientModule],
})
export class DonutModule {}
