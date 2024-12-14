import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MicroservicesEventConstant,
  RabbitmqMainMessages,
} from '@quick_response/number_api_event';
import { InjectVkApi } from 'nestjs-vk';
import {
  DonutSubscriptionContext,
  DonutWithdrawContext,
  getRandomId,
  VK,
} from 'vk-io';
import { MessagesSendParams } from 'vk-io/lib/api/schemas/params';
import { DonutSubscriptionPriceContext } from 'vk-io/lib/structures/contexts/donut-subscription-price';

import { VKChatsEnum } from '../../common/config/vk.chats.config';
import { TagMessageActionUserVk } from '../../common/constants/TagMessageActionUserVk';
import { RabbitmqApiMainService } from '../../common/rabbitmq/service/rabbitmq.api.main.service';
import { amountUtils } from '../../common/utils/amount.utils';
import { dateUtils } from '../../common/utils/date.utils';
import { VkService } from '../../vk/vk.service';

@Injectable()
export class DonutVkService {
  private readonly logger = new Logger(DonutVkService.name);

  private readonly isMessageSendUserDonut =
    this.configService.get('IS_SEND_MESSAGE_USER_DONUT') === 'true';

  constructor(
    @InjectVkApi() private readonly vk: VK,
    private readonly configService: ConfigService,
    private readonly vkHelpService: VkService,
    private readonly rabbitmqMainApiService: RabbitmqApiMainService,
  ) {}

  getTextDisableMessageSendUserDonut() {
    return this.isMessageSendUserDonut
      ? '\n\n❗️❗️Отправка сообщений пользователям выключена в настройках'
      : '';
  }

  // оформление подписки вк донут
  async create(ctx: DonutSubscriptionContext) {
    const date = Date.now();
    const data: RabbitmqMainMessages['donutCreate'] = {
      userId: ctx.userId,
      amount: ctx.amount,
      amountWithoutFee: ctx.amountWithoutFee,
      json: ctx.toJSON(),
    };

    try {
      const user = await this.vkHelpService.getInfoUserVk(ctx.userId);

      const textChat = `[${dateUtils.getDateFormatNumber(date)}] &#129395; @id${
        ctx.userId
      } ${user ? `(${user.first_name} ${user.last_name})` : ''} оформил подписку VK Donut.
      \nСумма: ${amountUtils.getFormatAmountRUB(ctx.amount)} (${amountUtils.getFormatAmountRUB(ctx.amountWithoutFee)} с комиссией)
      \n#donut_create #donutSubscriptionCreate #${TagMessageActionUserVk.VK_ID}${ctx.userId}`;
      await this.sendMessageChat(textChat, [VKChatsEnum.ADMIN_CHAT_DEV]);

      await this.rabbitmqMainApiService.emit(
        MicroservicesEventConstant.mainServiceApi.message.donutCreate,
        data,
      );
    } catch (error) {
      this.logger.error(
        `Не удалось отправить событие в RabbitMQ о выдачи подписки пользователю ${ctx.userId}`,
        error,
      );
      const textChatError = `‼ [${dateUtils.getDateFormatNumber(date)}] @id${
        ctx.userId
      } оформил подписку VK Donut, но я не могу отправить событие в RabbitMQ.
      \nСумма: ${amountUtils.getFormatAmountRUB(ctx.amount)} (${amountUtils.getFormatAmountRUB(ctx.amountWithoutFee)} с комиссией)
      \n#donut_create_error #donutSubscriptionCreateError #${TagMessageActionUserVk.VK_ID}${ctx.userId}`;
      await this.sendMessageChat(textChatError, [
        VKChatsEnum.LOGS_CHAT_DEV,
        VKChatsEnum.ADMIN_CHAT_DEV,
      ]);
    }
  }

  async prolonged(ctx: DonutSubscriptionContext) {
    const date = new Date().toString();
    const user = await this.vkHelpService.getInfoUserVk(ctx.userId);

    const textChat = `[${dateUtils.getDateFormatNumber(date)}] &#129395; @id${
      ctx.userId
    } (${user.first_name} ${user.last_name}) продлил подписку VK Donut.
    \n#donut_prolonged #donutSubscriptionProlonged #${TagMessageActionUserVk.VK_ID}${ctx.userId}`;
    await this.sendMessageChat(textChat, [VKChatsEnum.ADMIN_CHAT]);

    await this.rabbitmqMainApiService.emit(
      MicroservicesEventConstant.mainServiceApi.message.donutProlonged,
      {
        userId: user.id,
        json: ctx.toJSON(),
      },
    );
  }

  /**
   * Подписка истекла у пользователя
   */
  async expired(ctx: DonutSubscriptionContext) {
    const date = new Date().toString();
    const user = await this.vkHelpService.getInfoUserVk(ctx.userId);

    const textChat = `[${dateUtils.getDateFormatNumber(date)}] &#128553; @id${
      ctx.userId
    } (${user.first_name} ${user.last_name}) истекла подписка VK Donut.
    \n\n#donut_expired #donutSubscriptionExpired #${TagMessageActionUserVk.VK_ID}${ctx.userId}}`;
    await this.sendMessageChat(textChat, [VKChatsEnum.ADMIN_CHAT_DEV]);

    await this.rabbitmqMainApiService.emit(
      MicroservicesEventConstant.mainServiceApi.message.donutExpired,
      {
        userId: user.id,
        json: ctx.toJSON(),
      },
    );
  }

  /**
   * Отмена подписки пользователем
   */
  async cancelled(ctx: DonutSubscriptionContext) {
    const date = Date.now();
    const user = await this.vkHelpService.getInfoUserVk(ctx.userId);

    const textUser = `😢 ${user.first_name}, Вы отменили подписку VK Donut. Расскажите нам, что Вам не понравилось — мы обязательно станем лучше.\nПодписка продолжит действовать до конца оплаченного периода.`;
    await this.sendMessageUser(user.id, textUser);

    const textChat = `[${dateUtils.getDateFormatNumber(date)}] &#128553; @id${
      ctx.userId
    } (${user.first_name} ${user.last_name}) отменена подписка VK Donut.
    \n#donut_cancelled #donutSubscriptionСancelled #${TagMessageActionUserVk.VK_ID}${ctx.userId}`;

    await this.sendMessageChat(textChat, [VKChatsEnum.ADMIN_CHAT]);
  }

  /**
   * Изменение стоимости подписки
   */
  async priceChanged(ctx: DonutSubscriptionPriceContext) {
    const date = Date.now();
    const user = await this.vkHelpService.getInfoUserVk(ctx.userId);

    const textChat = `[${dateUtils.getDateFormatNumber(date)}] &#128553; @id${
      ctx.userId
    } (${user.first_name} ${user.last_name}) изменена цена подписки VK Donut.
    \nСтарая цена: ${amountUtils.getFormatAmountRUB(ctx.oldAmount)} рублей -> новая цена: ${amountUtils.getFormatAmountRUB(ctx.amount)}
    \n#donut_subscription_price_changed #donutsubscriptionPriceChanged #${TagMessageActionUserVk.VK_ID}${
      ctx.userId
    }`;
    await this.sendMessageChat(textChat, [VKChatsEnum.ADMIN_CHAT]);

    await this.rabbitmqMainApiService.emit(
      MicroservicesEventConstant.mainServiceApi.message.donutChangePrice,
      {
        userId: user.id,
        diffAmount: ctx.diffAmount,
        oldAmount: ctx.oldAmount,
        diffAmountWithoutFee: ctx.diffAmountWithoutFee,
        newAmount: ctx.newAmount,
        json: ctx.toJSON(),
      },
    );
  }

  /**
   * Вывод средств
   */
  async moneyWithdraw(ctx: DonutWithdrawContext) {
    const date = Date.now();

    const textChat = `[${dateUtils.getDateFormatNumber(
      date,
    )}] ✅💸 Вывод средств VK Donut в размере ${amountUtils.getFormatAmountRUB(ctx.amountWithoutFee)} рублей.
    \n#donut_money_withdraw #donutMoneyWithdraw`;

    await this.sendMessageChat(textChat, [
      VKChatsEnum.LOGS_CHAT_DEV,
      VKChatsEnum.ADMIN_CHAT,
    ]);
  }

  /**
   * Ошибка вывода средств
   */
  async moneyWithdrawError(ctx: DonutWithdrawContext) {
    const date = Date.now();

    const textChat = `@all [${dateUtils.getDateFormatNumber(
      date,
    )}] ❗💸 Ошибка вывод средств VK Donut, текст ошибки: ${ctx.reason}.
    \n#donut_money_withdraw_error #donutMoneyWithdrawError`;

    await this.sendMessageChat(textChat, [
      VKChatsEnum.LOGS_CHAT_DEV,
      VKChatsEnum.ADMIN_CHAT,
    ]);
  }

  async sendMessageChat(
    text: string,
    chatIds: VKChatsEnum[] = [VKChatsEnum.LOGS_CHAT_DEV],
    options?: MessagesSendParams,
  ) {
    const peersId = chatIds.map((chatId) => 2e9 + chatId);
    try {
      return this.vk.api.messages.send({
        message: `Сообщения отправлены в тестовом режиме
        \n\n${text}`,
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

  async sendMessageUser(
    userId: number,
    text: string,
    options?: MessagesSendParams,
  ) {
    if (!this.isMessageSendUserDonut) {
      return;
    }
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
