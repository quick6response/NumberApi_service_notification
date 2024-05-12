import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MainConstantEventName } from '@quick_response/number_api_event';
import { RabbitmqNotificationEventsType } from '../common/rabbitmq/types/rabbitmq.notification.events.type';
import { UserNumberNotificationDto } from './dto/user.number.notification.dto';
import { UserNumberService } from './user.number.service';

@Controller('user-number')
export class UserNumberController {
  constructor(private readonly userNumberService: UserNumberService) {}

  @MessagePattern<RabbitmqNotificationEventsType>(
    MainConstantEventName.notification.user_another_number_find,
  )
  async notificationNumberFind(@Payload() data: UserNumberNotificationDto) {
    return this.userNumberService.notificationFindNumber(data);
  }
}
