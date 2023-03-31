import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NumberFindDto } from './dto/number.find.dto';
import { NumbersService } from './numbers.service';

@Controller('number')
export class NumbersController {
  constructor(private readonly numbersService: NumbersService) {}
  @MessagePattern({ number: 'get' })
  async getInfo(@Payload() data: NumberFindDto) {
    return this.numbersService.getInfoNumber(data);
  }
}
