import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersCreateInterface } from './interface/users.create.interface';
import { UsersService } from './users.service';

export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @MessagePattern('users.new')
  usersNew(@Payload() data: UsersCreateInterface) {
    return this.usersService.notificationNewUser(data);
  }
}
