import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectVkApi } from 'nestjs-vk';
import { DonutSubscriptionContext, getRandomId, VK } from 'vk-io';
import { MessagesSendParams } from 'vk-io/lib/api/schemas/params';
import { VKChatsEnum } from '../common/config/vk.chats.config';

@Injectable()
export class DonatService {
  constructor(
    @InjectVkApi() private readonly vk: VK,
    private readonly configService: ConfigService,
  ) {}

  async create(ctx: DonutSubscriptionContext) {
    const textUser = ``;
    const textChat = ``;
  }

  async prolonged() {}

  async expired() {}

  async cancelled() {}

  async moneyWithdraw() {}

  async moneyWithdrawError() {}

  private async sendMessageChat(text: string, options?: MessagesSendParams) {
    try {
      return this.vk.api.messages.send({
        message: text,
        chat_id: VKChatsEnum.ADMIN_CHAT,
        random_id: getRandomId(),
        disable_mentions: true,
        ...options,
      });
    } catch (error) {
      return this.vk.api.messages.send({
        message: `Ошибка отправки сообщения о донате. ${error?.message}`,
        chat_id: VKChatsEnum.LOGS_CHAT,
        random_id: getRandomId(),
        disable_mentions: false,
      });
    }
  }

  private async sendMessageUser(
    userId: number,
    text: string,
    options?: MessagesSendParams,
  ) {
    try {
      // проверка на возможность писать
      const isMessageUser =
        await this.vk.api.messages.isMessagesFromGroupAllowed({
          user_id: userId,
          group_id: this.configService.get('VK_GROUP_ID'),
        });
      if (!isMessageUser.is_allowed) return;
      return this.vk.api.messages.send({
        message: text,
        user_id: userId,
        random_id: getRandomId(),
        ...options,
      });
    } catch (error) {
      return this.vk.api.messages.send({
        message: `Ошибка отправки сообщения о донате пользователю @id${userId}. ${error?.message}`,
        chat_id: VKChatsEnum.LOGS_CHAT,
        random_id: getRandomId(),
      });
    }
  }
}
