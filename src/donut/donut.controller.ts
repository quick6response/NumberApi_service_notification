import { EventPattern, Payload } from '@nestjs/microservices';
import { MicroservicesEventConstant } from '@quick_response/number_api_event';
import { DonutUserEventDto } from './dto/donut.user.event.dto';
import { DonutNotificationService } from './service/donut.notification.service';

export class DonutController {
  constructor(private readonly donutService: DonutNotificationService) {}
  @EventPattern(
    MicroservicesEventConstant.notification.donut_subscriptionIssuance,
  )
  async subscriptionIssuance(@Payload() data: DonutUserEventDto) {
    return await this.donutService.subscriptionIssuance(data);
  }

  @EventPattern(
    MicroservicesEventConstant.notification.donut_subscriptionExpired,
  )
  async subscriptionExpired(@Payload() data: DonutUserEventDto) {
    return await this.donutService.subscriptionExpired(data);
  }

  @EventPattern(
    MicroservicesEventConstant.notification.donut_subscriptionProlonged,
  )
  async subscriptionProlonged(@Payload() data: DonutUserEventDto) {
    return await this.donutService.subscriptionProlonged(data);
  }
}
