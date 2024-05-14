import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Ctx } from 'nestjs-vk';
import { RabbitmqNotificationEventsType } from '../common/rabbitmq/types/rabbitmq.notification.events.type';
import { NumberFindDto, NumberFindErrorDto } from './dto/number.find.dto';
import { NumbersService } from './numbers.service';

const KEY_FIND: RabbitmqNotificationEventsType = 'number_find';
const KEY_ERROR_FIND: RabbitmqNotificationEventsType = 'number_find_error';

@Controller('number')
export class NumbersController {
  constructor(private readonly numbersService: NumbersService) {}
  @MessagePattern(KEY_FIND)
  async getInfo(@Payload() data: NumberFindDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const call = await this.numbersService.getInfoNumber(data);

    if (call.result) {
      return channel.ack(originalMessage);
    }
  }

  @MessagePattern(KEY_ERROR_FIND)
  async errorFind(
    @Payload() data: NumberFindErrorDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const call = await this.numbersService.numberFindError(data);

    if (call.result) {
      return channel.ack(originalMessage);
    }
  }
}
