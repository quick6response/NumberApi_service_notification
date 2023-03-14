import { Injectable } from '@nestjs/common';
import { InjectVkApi } from 'nestjs-vk';
import { VK } from 'vk-io';

@Injectable()
export class UsersService {
  constructor(@InjectVkApi() private readonly vk: VK) {}
}
