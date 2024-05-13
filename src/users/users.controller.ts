import { Controller, Get } from '@nestjs/common';

// todo переписать это и ДТО операторов на новые типы из АПИ - добавлены события - создание и изменение пользователя

@Controller('users')
export class UsersController {
  @Get()
  get() {
    return 'get users';
  }
}
