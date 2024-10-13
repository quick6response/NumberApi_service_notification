import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MicroservicesEventConstant } from '@quick_response/number_api_event';
import { NumberFindDto, NumberFindErrorDto } from './dto/number.find.dto';
import { NumbersService } from './numbers.service';

@Controller('number')
export class NumbersController {
  constructor(private readonly numbersService: NumbersService) {}
  @EventPattern(MicroservicesEventConstant.notification.number_find)
  async getInfo(@Payload() data: NumberFindDto) {
    return await this.numbersService.getInfoNumber(data);
  }

  @EventPattern(MicroservicesEventConstant.notification.number_find_error)
  async errorFind(@Payload() data: NumberFindErrorDto) {
    return await this.numbersService.numberFindError(data);
  }
}
