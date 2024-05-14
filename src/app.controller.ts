import { Controller } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Ctx } from 'nestjs-vk';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern()
  async handleDefaultEvent(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context?.getChannelRef();
    const originalMessage = context?.getMessage();
    const call =
      await this.appService.sendMessageDefaultEventOrMessagePattern(data);

    return channel?.ack(originalMessage);
  }

  @MessagePattern()
  async handleDefaultMessage(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context?.getChannelRef();
    const originalMessage = context?.getMessage();
    const call =
      await this.appService.sendMessageDefaultEventOrMessagePattern(data);

    return channel?.ack(originalMessage);
  }
}
