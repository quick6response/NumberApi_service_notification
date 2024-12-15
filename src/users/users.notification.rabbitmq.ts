import { Injectable } from '@nestjs/common';
import {
  MicroservicesEventConstant,
  RabbitmqExchangesConstant,
} from 'microservice';

import { UserCreateDto, UserEditDto } from './dto/users.dto';
import { UsersService } from './users.service';
import { RabbitmqSubscribeNotificationService } from '../common/rabbitmq/decorators/rabbitmqSubscribeNotificationService';

@Injectable()
export class UsersNotificationRabbitmq {
  constructor(private readonly userService: UsersService) {}

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,

    routingKey: MicroservicesEventConstant.notification.user_create,
  })
  async notificationUserCreate(data: UserCreateDto) {
    return await this.userService.notificationUserCreate(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,

    routingKey: MicroservicesEventConstant.notification.user_edit,
  })
  async notificationUserEdit(data: UserEditDto) {
    return await this.userService.notificationUserEdit(data);
  }
}
