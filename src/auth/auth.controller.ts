import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ParameterStartInterface } from '../common/interface/parameter.start.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @MessagePattern('auth.login')
  async login(
    @Payload() data: { parameter: ParameterStartInterface; date: string },
    @Ctx() context: RmqContext,
  ) {
    await this.authService.loginUser(data.parameter, data.date);
    return { result: true };
  }
}
