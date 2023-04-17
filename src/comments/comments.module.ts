import { Module } from '@nestjs/common';
import { NumbersModule } from '../numbers/numbers.module';
import { VkHelpModule } from '../vk/vk.help.module';
import { CommentsController } from './comments.controller';
import { CommentsKeyboardService } from './comments.keyboard.service';
import { CommentsService } from './comments.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, CommentsKeyboardService],
  imports: [VkHelpModule, NumbersModule],
})
export class CommentsModule {}
