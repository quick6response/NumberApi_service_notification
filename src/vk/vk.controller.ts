import { Body, Controller, Post, Query } from '@nestjs/common';
import { InjectVkApi } from 'nestjs-vk';
import { VK } from 'vk-io';

const vk = new VK({
  token: process.env.VK_GROUP_TOKEN,
});

@Controller('vk')
export class VkController {
  constructor(@InjectVkApi() private vk: VK) {}
  @Post()
  async callback(@Query() query, @Body() body) {
    return vk.updates.getWebhookCallback();
  }
}
