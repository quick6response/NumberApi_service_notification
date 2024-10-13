import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MicroservicesEventConstant } from '@quick_response/number_api_event';
import { AuthService } from './auth.service';
import { VkAuthRegistrationDto } from './dto/vk.auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @EventPattern(MicroservicesEventConstant.notification.auth_login_user)
  async login(@Payload() data: VkAuthRegistrationDto) {
    return await this.authService.loginUser(data);
  }

  @EventPattern(MicroservicesEventConstant.notification.auth_register_user)
  async registration(@Payload() data: VkAuthRegistrationDto) {
    return await this.authService.registrationUser(data);
  }
}
