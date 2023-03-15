import { Module } from '@nestjs/common';
import { VkHelpModule } from '../vk/vk.help.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [VkHelpModule],
})
export class AuthModule {}
