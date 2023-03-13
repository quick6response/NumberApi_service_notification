import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ParameterStartInterface } from '../common/interface/parameter.start.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @MessagePattern('auth.login')
  async login(@Payload() data: ParameterStartInterface) {
    return this.authService.loginUser(data);
  }
}
