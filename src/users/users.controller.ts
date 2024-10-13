import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MicroservicesEventConstant } from '@quick_response/number_api_event';
import { UserCreateDto, UserEditDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @EventPattern(MicroservicesEventConstant.notification.user_create)
  async notificationUserCreate(@Payload() data: UserCreateDto) {
    return await this.userService.notificationUserCreate(data);
  }

  @EventPattern(MicroservicesEventConstant.notification.user_edit)
  async notificationUserEdit(@Payload() data: UserEditDto) {
    return await this.userService.notificationUserEdit(data);
  }
}
