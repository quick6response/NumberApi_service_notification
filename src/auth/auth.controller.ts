import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ParameterStartDto } from '../common/dto/parameter.start.dto';
import { UsersCreateInterface } from '../users/interface/users.create.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ auth: 'login' })
  async login(@Payload() data: ParameterStartDto) {
    return this.authService.loginUser(data);
  }

  @MessagePattern({ auth: 'register' })
  async registration(@Payload() data: UsersCreateInterface) {
    return this.authService.registrationUser(data);
  }
}
