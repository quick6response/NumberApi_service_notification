import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RabbitmqNotificationKey } from '../common/rabbitmq/types/rabbitmq.notification.key.type';
import { UserNumberNotificationDto } from './dto/user.number.notification.dto';
import { UserNumberService } from './user.number.service';

const KEY_NOTIFICATION_NUMBER_USER: RabbitmqNotificationKey =
  'users_number_get';
@Controller('user-number')
export class UserNumberController {
  constructor(private readonly userNumberService: UserNumberService) {}
  @MessagePattern(KEY_NOTIFICATION_NUMBER_USER)
  async notificationNumberFind(@Payload() data: UserNumberNotificationDto) {
    return this.userNumberService.notificationFindNumber(data);
  }
}
