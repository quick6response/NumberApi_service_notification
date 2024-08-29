import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { MicroservicesEventConstant } from '@quick_response/number_api_event';
import { Ctx } from 'nestjs-vk';
import { UserCreateDto, UserEditDto } from './dto/users.dto';
import { UsersService } from './users.service';

// todo переписать это и ДТО операторов на новые типы из АПИ - добавлены события - создание и изменение пользователя

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @MessagePattern(MicroservicesEventConstant.notification.user_create)
  async notificationUserCreate(
    @Payload() data: UserCreateDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const call = await this.userService.notificationUserCreate(data);

    if (call.result) {
      return channel.ack(originalMessage);
    }
  }

  @MessagePattern(MicroservicesEventConstant.notification.user_edit)
  async notificationUserEdit(
    @Payload() data: UserEditDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const call = await this.userService.notificationUserEdit(data);

    if (call.result) {
      return channel.ack(originalMessage);
    }
  }
}
