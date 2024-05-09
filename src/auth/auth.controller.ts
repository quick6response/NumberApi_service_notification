import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MainConstantEventName } from '@quick_response/number_api_event/dist/_types';
import { AuthService } from './auth.service';
import { VkAuthRegistrationDto } from './dto/vk.auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(MainConstantEventName.notification.auth_login_user)
  async login(@Payload() data: VkAuthRegistrationDto) {
    return this.authService.loginUser(data);
  }

  @MessagePattern(MainConstantEventName.notification.auth_register_user)
  async registration(@Payload() data: VkAuthRegistrationDto) {
    return this.authService.registrationUser(data);
  }
}
