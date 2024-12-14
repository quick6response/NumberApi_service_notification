import { Injectable } from '@nestjs/common';
import {
  MicroservicesEventConstant,
  RabbitmqExchangesConstant,
} from '@quick_response/number_api_event';

import { AuthService } from './auth.service';
import { VkAuthLoginDto, VkAuthRegistrationDto } from './dto/vk.auth.dto';
import { RabbitmqSubscribeNotificationService } from '../common/rabbitmq/decorators/rabbitmqSubscribeNotificationService';

@Injectable()
export class AuthNotificationRabbitmq {
  constructor(private readonly authService: AuthService) {}

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey: MicroservicesEventConstant.notification.auth_login_user,
  })
  async login(data: VkAuthLoginDto) {
    return await this.authService.loginUser(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey: MicroservicesEventConstant.notification.auth_register_user,
  })
  async registration(data: VkAuthRegistrationDto) {
    return await this.authService.registrationUser(data);
  }
}
