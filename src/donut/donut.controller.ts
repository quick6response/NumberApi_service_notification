import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DonutService } from './donut.service';
import { DonutUserDto } from './dto/donut.user.dto';

@Controller('donut')
export class DonutController {
  constructor(private readonly donutService: DonutService) {}
  @MessagePattern('donut.subscriptionIssuance')
  async subscriptionIssuance(@Payload() data: DonutUserDto) {
    return this.donutService.subscriptionIssuance(data);
  }

  @MessagePattern('donut.subscriptionExpired')
  async subscriptionExpired(@Payload() data: DonutUserDto) {
    return this.donutService.subscriptionExpired(data);
  }
}
