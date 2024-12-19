import { Injectable } from '@nestjs/common';
import { InjectVkApi } from 'nestjs-vk';
import { VK } from 'vk-io';

import { VkService } from './vk/vk.service';

@Injectable()
export class AppService {
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
    private readonly vkHelpService: VkService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
}
