import { Injectable } from '@nestjs/common';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';
import { VKChatsEnum } from './common/config/vk.chats.config';
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

  async sendMessageDefaultEventOrEventPattern(data: any) {
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT_DEV,
      message: `data: ${JSON.stringify(data)}\n\n#notifion_not_pattern`,
      random_id: getRandomId(),
      disable_mentions: true,
    });
  }
}
