import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { MainConstantEventName } from '@quick_response/number_api_event';
import { Ctx } from 'nestjs-vk';
import { DonutService } from './donut.service';
import { DonutUserEventDto } from './dto/donut.user.event.dto';

@Controller('donut')
export class DonutController {
  constructor(private readonly donutService: DonutService) {}
  @MessagePattern(MainConstantEventName.notification.donut_subscriptionIssuance)
  async subscriptionIssuance(
    @Payload() data: DonutUserEventDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const call = await this.donutService.subscriptionIssuance(data);

    return channel.ack(originalMessage);
  }

  @MessagePattern(MainConstantEventName.notification.donut_subscriptionExpired)
  async subscriptionExpired(
    @Payload() data: DonutUserEventDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const call = await this.donutService.subscriptionExpired(data);

    return channel.ack(originalMessage);
  }
  // todo событие о изменение стоимости подписки
  // @MessagePattern('donut_subscriptionExpired')
  // async subscriptionExpired(@Payload() data: DonutUserDto) {
  //   return this.donutService.subscriptionExpired(data);
  // }
}
