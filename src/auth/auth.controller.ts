import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { MicroservicesEventConstant } from '@quick_response/number_api_event';
import { Ctx } from 'nestjs-vk';
import { AuthService } from './auth.service';
import { VkAuthRegistrationDto } from './dto/vk.auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(MicroservicesEventConstant.notification.auth_login_user)
  async login(
    @Payload() data: VkAuthRegistrationDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const call = await this.authService.loginUser(data);

    if (call.result) {
      return channel.ack(originalMessage);
    }
  }

  @MessagePattern(MicroservicesEventConstant.notification.auth_register_user)
  async registration(
    @Payload() data: VkAuthRegistrationDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const call = await this.authService.registrationUser(data);

    if (call.result) {
      return channel.ack(originalMessage);
    }
  }
}
