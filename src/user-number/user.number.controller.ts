import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RabbitmqNotificationEventsType } from '../common/rabbitmq/types/rabbitmq.notification.events.type';
import { UserNumberNotificationDto } from './dto/user.number.notification.dto';
import { UserNumberService } from './user.number.service';

const KEY_NOTIFICATION_NUMBER_USER: RabbitmqNotificationEventsType =
  'users_number_get';
@Controller('user-number')
export class UserNumberController {
  constructor(private readonly userNumberService: UserNumberService) {}

  @MessagePattern(KEY_NOTIFICATION_NUMBER_USER)
  async notificationNumberFind(@Payload() data: UserNumberNotificationDto) {
    return this.userNumberService.notificationFindNumber(data);
  }
}
