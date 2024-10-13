import { Controller } from '@nestjs/common';
import { EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MicroservicesEventConstant } from '@quick_response/number_api_event';
import { Ctx } from 'nestjs-vk';
import { DonutService } from './donut.service';
import { DonutUserEventDto } from './dto/donut.user.event.dto';

@Controller('donut')
export class DonutController {
  constructor(private readonly donutService: DonutService) {}
  @EventPattern(
    MicroservicesEventConstant.notification.donut_subscriptionIssuance,
  )
  async subscriptionIssuance(
    @Payload() data: DonutUserEventDto,
    @Ctx() context: RmqContext,
  ) {
    return await this.donutService.subscriptionIssuance(data);
  }

  @EventPattern(
    MicroservicesEventConstant.notification.donut_subscriptionExpired,
  )
  async subscriptionExpired(
    @Payload() data: DonutUserEventDto,
    @Ctx() context: RmqContext,
  ) {
    return await this.donutService.subscriptionExpired(data);
  }
  // todo событие о изменение стоимости подписки
  // @EventPattern('donut_subscriptionExpired')
  // async subscriptionExpired(@Payload() data: DonutUserDto) {
  //   return this.donutService.subscriptionExpired(data);
  // }
}
