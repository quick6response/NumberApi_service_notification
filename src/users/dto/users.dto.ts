import {
  UserCreateDtoInterface,
  UserDtoInterface,
  UserUpdateDtoInterface,
  UserVkDtoInterface,
} from '@numberapi/microservices/notification';

export class UserCreateDto implements UserCreateDtoInterface {
  date: number;
  reason: string;
  userInfo: UserDtoInterface;
  userInfoVk: UserVkDtoInterface;
}

export class UserEditDto implements UserUpdateDtoInterface {
  date: number;
  nextValue: UserDtoInterface;
  preValue: UserDtoInterface;
  reason: string;
}
