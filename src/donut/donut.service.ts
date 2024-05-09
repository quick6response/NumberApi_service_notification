import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectVkApi } from 'nestjs-vk';
import {
  DonutSubscriptionContext,
  DonutWithdrawContext,
  getRandomId,
  Keyboard,
  VK,
} from 'vk-io';
import { MessagesSendParams } from 'vk-io/lib/api/schemas/params';
import { DonutSubscriptionPriceContext } from 'vk-io/lib/structures/contexts/donut-subscription-price';
import { VKChatsEnum } from '../common/config/vk.chats.config';
import { RabbitmqApiMainService } from '../common/rabbitmq/service/rabbitmq.api.main.service';
import { dateUtils } from '../common/utils/date.utils';
import { UserVkInterface, VkService } from '../vk/vk.service';
import { DonutUserEventDto } from './dto/donut.user.event.dto';

@Injectable()
export class DonutService {
  private readonly logger = new Logger(DonutService.name);

  constructor(
    @InjectVkApi() private readonly vk: VK,
    private readonly configService: ConfigService,
    private readonly vkHelpService: VkService,
    private readonly rabbitmqMainApiService: RabbitmqApiMainService,
  ) {}

  /**
   * Подписка выдана сервисом
   */
  async subscriptionIssuance(data: DonutUserEventDto) {
    const user = await this.vkHelpService.getInfoUserVk(data.userId);
    const textChat = `Пользователю @id${data.userId} (${user.first_name} ${
      user.last_name
    }) была выдана подписка VK Donut.
    \nВремя: ${dateUtils.getDateFormatNumber(data.date)}
    \n#donut_issuance #subscriptionIssuance #id${data.userId}`;
    const textUser = `&#129395; ${user.first_name}, благодарим Вас за оформление подписки VK Donut!\nО преимуществах подписки, можно узнать в [https://vk.com/@id_called-donut|статье].\nЕщё у нас есть беседа для обладателей подписки VK Donut`;

    await this.sendMessageUser(user.id, textUser, {
      keyboard: this.getKeyboardAboutBenefits(),
    });
    await this.sendMessageChat(textChat, [VKChatsEnum.LOGS_CHAT_DEV]);
  }

  private getKeyboardAboutBenefits() {
    const builder = Keyboard.keyboard([
      // Одна кнопка
      [
        Keyboard.callbackButton({
          label: 'Подробнее про подписку VK Donut',
          color: 'secondary',
          payload: {
            type: 'text',
            cmd: 'donut about',
          },
        }),
      ],
    ]).inline();
  }
  /**
   * Подписка отключена сервисом
   */
  async subscriptionExpired(data: DonutUserEventDto) {
    const user = await this.vkHelpService.getInfoUserVk(data.userId);
    const textChat = `Подписка у пользователя @id${data.userId} (${
      user.first_name
    } ${user.last_name}) была выключена.
    \n\nВремя: ${dateUtils.getDateFormatNumber(data.date)}
    \n\n#donut_Expired #subscriptionExpired #id${data.userId} #vk_id${data.userVkId}`;
    await this.sendMessageChat(textChat, [VKChatsEnum.LOGS_CHAT_DEV]);
  }

  // оформление подписки вк донут
  async create(ctx: DonutSubscriptionContext) {
    const date = Date.now();
    let errorSendRabbit = false;
    try {
      this.rabbitmqMainApiService.emit('donut.create', {
        userId: ctx.userId,
        amount: ctx.amount,
        amountWithoutFee: ctx.amountWithoutFee,
        json: ctx.toJSON(),
      });
    } catch (e) {
      this.logger.error(
        `Не удалось отправить событие в RabbitMQ о выдачи подписки пользователю ${ctx.userId}`,
        e,
      );
      // задержка 5 секунд перед повтором попытки
      await new Promise((resolve) => setTimeout(resolve, 5000));
      try {
        this.rabbitmqMainApiService.emit('donut.create', {
          userId: ctx.userId,
          amount: ctx.amount,
          amountWithoutFee: ctx.amountWithoutFee,
          json: ctx.toJSON(),
        });
      } catch {
        errorSendRabbit = true;
        const textChatError = `‼ [${dateUtils.getDateFormatNumber(date)}] @id${
          ctx.userId
        } оформил подписку VK Donut, но я не могу отправить событие в RabbitMQ.\n\nСумма: ${ctx.amount} (${ctx.amountWithoutFee} с комиссией)\n\nТекст ошибки: ${e}\n\n#donut_create_error #donutSubscriptionCreateError #vk_id${
          ctx.userId
        }`;
        await this.sendMessageChat(textChatError, [
          VKChatsEnum.LOGS_CHAT_DEV,
          VKChatsEnum.ADMIN_CHAT_DEV,
        ]);
      }
    }
    // у нас возникла ошибка rabbit, мы не смогли отправить событие
    if (errorSendRabbit) {
      return;
    }

    let textChat;
    try {
      const user = await this.vkHelpService.getInfoUserVk(ctx.userId);

      textChat = this.getTextSuccessSubscription(date, ctx, user);
    } catch (err) {
      textChat = this.getTextSuccessSubscription(date, ctx);
    }

    await this.sendMessageChat(textChat, [
      VKChatsEnum.LOGS_CHAT_DEV,
      VKChatsEnum.ADMIN_CHAT_DEV,
    ]);
  }

  private getTextSuccessSubscription(
    date: number,
    ctx: DonutSubscriptionContext,
    user?: UserVkInterface,
  ) {
    return `[${dateUtils.getDateFormatNumber(date)}] &#129395; @id${
      ctx.userId
    } ${user ? `(${user.first_name} ${user.last_name})` : ''} оформил подписку VK Donut.\n\nСумма: ${ctx.amount} (${ctx.amountWithoutFee} с комиссией)\n\n#donut_create #donutSubscriptionCreate #vk_id${
      ctx.userId
    }`;
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

    this.rabbitmqMainApiService.emit('donut.prolonged', {
      userId: user.id,
      json: ctx.toJSON(),
    });
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

    this.rabbitmqMainApiService.emit('donut.expired', {
      userId: user.id,
      json: ctx.toJSON(),
    });
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

    this.rabbitmqMainApiService.emit('donut.expired', {
      userId: user.id,
      json: ctx.toJSON(),
    });
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
    this.rabbitmqMainApiService.emit('donut.subscriptionPriceChanged', {
      userId: user.id,
      json: ctx.toJSON(),
    });
  }

  private async sendMessageChat(
    text: string,
    chatIds: VKChatsEnum[] = [VKChatsEnum.LOGS_CHAT_DEV],
    options?: MessagesSendParams,
  ) {
    const peersId = chatIds.map((chatId) => 2e9 + chatId);
    try {
      return this.vk.api.messages.send({
        message: text,
        random_id: getRandomId(),
        disable_mentions: true,
        peer_ids: peersId,
        ...options,
      });
    } catch (error) {
      return this.vk.api.messages.send({
        message: `Ошибка отправки сообщения о донате. ${error?.message}`,
        chat_id: VKChatsEnum.LOGS_CHAT_DEV,
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
        chat_id: VKChatsEnum.LOGS_CHAT_DEV,
        random_id: getRandomId(),
      });
    }
  }
}
