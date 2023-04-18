import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RabbitmqNotificationKey } from '../common/rabbitmq/types/rabbitmq.notification.key.type';
import { NumberFindDto } from './dto/number.find.dto';
import { NumberFindErrorDto } from './dto/number.find.error.dto';
import { NumbersService } from './numbers.service';

const KEY_FIND: RabbitmqNotificationKey = 'number_find';
const KEY_ERROR_FIND: RabbitmqNotificationKey = 'number_find_error';

@Controller('number')
export class NumbersController {
  constructor(private readonly numbersService: NumbersService) {}
  @MessagePattern(KEY_FIND)
  async getInfo(@Payload() data: NumberFindDto) {
    return this.numbersService.getInfoNumber(data);
  }

  @MessagePattern(KEY_ERROR_FIND)
  async errorFind(@Payload() data: NumberFindErrorDto) {
    return this.numbersService.numberFindError(data);
  }
}
