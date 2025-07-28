import {
  UserCreateDtoInterface,
  UserDtoInterface,
  UserUpdateDtoInterface,
  UserVkDtoInterface,
} from 'numberapi-common/microservice/notification';

export class UserCreateDto implements UserCreateDtoInterface {
  date: number;
  reason: string;
  userInfo: UserDtoInterface;
  userInfoVk: UserVkDtoInterface;
}

export class UserEditDto implements UserUpdateDtoInterface {
  date: number;
  nextValue: UserDtoInterface;
  prevValue: UserDtoInterface;
  reason: string;
}
