import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RabbitmqNotificationEventsType } from '../common/rabbitmq/types/rabbitmq.notification.events.type';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.login.dto';
import { AuthRegisterDto } from './dto/auth.register.dto';

const KEY_LOGIN: RabbitmqNotificationEventsType = 'auth_login_user';
const KEY_REGISTER: RabbitmqNotificationEventsType = 'auth_register_user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(KEY_LOGIN)
  async login(@Payload() data: AuthLoginDto) {
    return this.authService.loginUser(data);
  }

  @MessagePattern(KEY_REGISTER)
  async registration(@Payload() data: AuthRegisterDto) {
    return this.authService.registrationUser(data);
  }
}
