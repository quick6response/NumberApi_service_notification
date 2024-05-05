import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { InjectVkApi } from 'nestjs-vk';
import {
  DonutSubscriptionContext,
  DonutWithdrawContext,
  getRandomId,
  VK,
} from 'vk-io';
import { MessagesSendParams } from 'vk-io/lib/api/schemas/params';
import { DonutSubscriptionPriceContext } from 'vk-io/lib/structures/contexts/donut-subscription-price';
import { VKChatsEnum } from '../common/config/vk.chats.config';
import { dateUtils } from '../common/utils/date.utils';
import { VkService } from '../vk/vk.service';
import { DonutUserDto } from './dto/donut.user.dto';

@Injectable()
export class DonutService {
  constructor(
    @InjectVkApi() private readonly vk: VK,
    private readonly configService: ConfigService,
    private readonly vkHelpService: VkService,
    @Inject('DONUT_SERVICE') private client: ClientProxy,
  ) {}

  /**
   * Подписка выдана сервером
   */
  async subscriptionIssuance(data: DonutUserDto) {
    const user = await this.vkHelpService.getInfoUserVk(data.userId);
    const textChat = `Пользователю @id${data.userId} (${user.first_name} ${
      user.last_name
    }) была выдана подписка VK Donut.
    \nВремя: ${dateUtils.getDateFormatNumber(data.date)}
    \n#donut_issuance #subscriptionIssuance #id${data.userId}`;
    await this.sendMessageChat(textChat, VKChatsEnum.LOGS_CHAT);
  }

  /**
   * Подписка убрана сервером
   */
  async subscriptionExpired(data: DonutUserDto) {
    const user = await this.vkHelpService.getInfoUserVk(data.userId);
    const textChat = `Подписка у пользователя @id${data.userId} (${
      user.first_name
    } ${user.last_name}) была выключена.
    \nВремя: ${dateUtils.getDateFormatNumber(data.date)}
    \n#donut_Expired #subscriptionExpired #id${data.userId}`;
    await this.sendMessageChat(textChat, VKChatsEnum.LOGS_CHAT);
  }

  //
  async create(ctx: DonutSubscriptionContext) {
    const date = new Date().toString();
    const user = await this.vkHelpService.getInfoUserVk(ctx.userId);
    const textUser = `&#129395; ${user.first_name}, благодарим Вас за оформление подписки VK Donut! О преимуществах подписки, можно узнать в [https://vk.com/@id_called-donut|статье].\nНе забудьте вступить в чат для донов.`;
    const textChat = `[${dateUtils.getDateFormatNumber(date)}] &#129395; @id${
      ctx.userId
    } (${user.first_name} ${
      user.last_name
    }) оформил подписку VK Donut.\n#donut_create #donutSubscriptionCreate #id${
      ctx.userId
    }`;
    // await this.sendMessageUser(user.id, textUser);
    await this.sendMessageChat(textChat);

    this.client.emit('donut.create', { userId: user.id });
  }

  async prolonged(ctx: DonutSubscriptionContext) {
    const date = new Date().toString();
    const user = await this.vkHelpService.getInfoUserVk(ctx.userId);
    const textUser = `&#129395; ${user.first_name}, благодарим Вас за продление подписки VK Donut! Все Ваши преимущества сохранены, также о них можно узнать в [https://vk.com/@id_called-donut|статье].`;
    const textChat = `[${dateUtils.getDateFormatNumber(date)}] &#129395; @id${
      ctx.userId
    } (${user.first_name} ${
      user.last_name
    }) продлил подписку VK Donut.\n#donut_prolonged #donutSubscriptionProlonged #id${
      ctx.userId
    }`;
    // await this.sendMessageUser(user.id, textUser);
    await this.sendMessageChat(textChat);

    this.client.emit('donut.prolonged', { userId: user.id });
  }

  async expired(ctx: DonutSubscriptionContext) {
    const date = new Date().toString();
    const user = await this.vkHelpService.getInfoUserVk(ctx.userId);
    const textUser = `&#128553; ${user.first_name}, подписка VK Donut истекла. Все преимущества были выключены.`;
    const textChat = `[${dateUtils.getDateFormatNumber(date)}] &#128553; @id${
      ctx.userId
    } (${user.first_name} ${
      user.last_name
    }) истекла подписка VK Donut.\n#donut_expired #donutSubscriptionExpired #id${
      ctx.userId
    }`;
    // await this.sendMessageUser(user.id, textUser);
    await this.sendMessageChat(textChat);

    this.client.emit('donut.expired', { userId: user.id });
  }

  async cancelled(ctx: DonutSubscriptionContext) {
    const date = new Date().toString();
    const user = await this.vkHelpService.getInfoUserVk(ctx.userId);
    const textUser = `😢 ${user.first_name}, Вы отменили подписку VK Donut. Расскажите нам, что Вам не понравилось — мы обязательно станем лучше.\nПодписка продолжит действовать до конца оплаченного периода.`;
    const textChat = `[${dateUtils.getDateFormatNumber(date)}] &#128553; @id${
      ctx.userId
    } (${user.first_name} ${
      user.last_name
    }) отменена подписка VK Donut.\n#donut_cancelled #donutSubscriptionСancelled #id${
      ctx.userId
    }`;
    // await this.sendMessageUser(user.id, textUser);
    await this.sendMessageChat(textChat);
  }

  async moneyWithdraw(ctx: DonutWithdrawContext) {
    const date = new Date().toString();
    const textChat = `[${dateUtils.getDateFormatNumber(
      date,
    )}] ✅💸 вывод средств VK Donut в размере ${
      ctx.amountWithoutFee
    } рублей.\n#donut_money_withdraw #donutMoneyWithdraw`;
    await this.sendMessageChat(textChat);
  }

  async moneyWithdrawError(ctx: DonutWithdrawContext) {
    const date = new Date().toString();
    const textChat = `[${dateUtils.getDateFormatNumber(
      date,
    )}] ❗💸 ошибка вывод средств VK Donut, текст ошибки: ${
      ctx.reason
    }.\n#donut_money_withdraw_error #donutMoneyWithdrawError`;
    await this.sendMessageChat(textChat);
  }

  // todo дописать метод на верный текст и верное событие для отправки
  async subscriptionPriceChanged(ctx: DonutSubscriptionPriceContext) {
    const date = new Date().toString();
    const user = await this.vkHelpService.getInfoUserVk(ctx.userId);
    const textUser = `&#128553; ${user.first_name}, подписка VK Donut истекла. Все преимущества были выключены.`;
    const textChat = `[${dateUtils.getDateFormatNumber(date)}] &#128553; @id${
      ctx.userId
    } (${user.first_name} ${
      user.last_name
    }) истекла подписка VK Donut.\n#donut_subscription_price_changed #donutsubscriptionPriceChanged #id${
      ctx.userId
    }`;
    // await this.sendMessageUser(user.id, textUser);
    await this.sendMessageChat(textChat);
    this.client.emit('donut.subscriptionPriceChanged', { userId: user.id });
  }

  private async sendMessageChat(
    text: string,
    chatId?: VKChatsEnum,
    options?: MessagesSendParams,
  ) {
    try {
      return this.vk.api.messages.send({
        message: text,
        chat_id: chatId ?? VKChatsEnum.ADMIN_CHAT,
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
