import { Ctx, InjectVkApi, On, Update } from 'nestjs-vk';
import { DonutSubscriptionContext, DonutWithdrawContext, VK } from 'vk-io';
import { DonutSubscriptionPriceContext } from 'vk-io/lib/structures/contexts/donut-subscription-price';
import { DonutService } from './donut.service';

@Update()
export class DonutUpdate {
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
    private readonly donutService: DonutService,
  ) {}

  // @Hears(/^\/?(expired donut)$/i)
  // async getDonut(@Ctx() ctx: MessageContext) {
  //   // @ts-ignore
  //   await this.expired({
  //     payload: {
  //       user_id: ctx.senderId,
  //       amount: 59,
  //       amount_without_fee: 56,
  //     },
  //     api: this.vk.api,
  //     get userId(): number {
  //       return ctx.senderId;
  //     },
  //     get amountWithoutFee(): number {
  //       return this.amountWithoutFee;
  //     },
  //     get isProlonged(): boolean {
  //       return true;
  //     },
  //     get amount(): number {
  //       return this.amount;
  //     },
  //     get isExpired(): boolean {
  //       return true;
  //     },
  //     get isCreated(): boolean {
  //       return false;
  //     },
  //     upload: this.vk.upload,
  //     state: {},
  //     type: 'donut_subscription',
  //   });
  // }

  @On('donut_subscription_create')
  async create(@Ctx() ctx: DonutSubscriptionContext) {
    return this.donutService.create(ctx);
  }

  @On('donut_subscription_prolonged')
  prolonged(@Ctx() ctx: DonutSubscriptionContext) {
    if (!ctx.isProlonged) return;
    return this.donutService.prolonged(ctx);
  }

  @On('donut_subscription_expired')
  expired(@Ctx() ctx: DonutSubscriptionContext) {
    return this.donutService.expired(ctx);
  }

  @On('donut_subscription_cancelled')
  cancelled(@Ctx() ctx: DonutSubscriptionContext) {
    return this.donutService.cancelled(ctx);
  }

  @On('donut_subscription_price_changed')
  priceChanged(@Ctx() ctx: DonutSubscriptionPriceContext) {
    return this.donutService.subscriptionPriceChanged(ctx);
  }

  // @Hears(/^\/?(donut_money_withdraw_error)$/i)
  // async getDonut(@Ctx() ctx: MessageContext) {
  //   // @ts-ignore
  //   await this.moneyWithdrawError({
  //     payload: {
  //       amount: 59,
  //       amount_without_fee: 56,
  //       reason: 'Денег нет, но вы держитесь!',
  //     },
  //     api: this.vk.api,
  //     get userId(): number {
  //       return ctx.senderId;
  //     },
  //     get amountWithoutFee(): number {
  //       return 56;
  //     },
  //     get isProlonged(): boolean {
  //       return true;
  //     },
  //     get amount(): number {
  //       return 59;
  //     },
  //     get isExpired(): boolean {
  //       return true;
  //     },
  //     get reason(): string {
  //       return 'Денег нет, но вы держитесь!';
  //     },
  //     get isCreated(): boolean {
  //       return false;
  //     },
  //     upload: this.vk.upload,
  //     state: {},
  //     type: 'donut_withdraw',
  //   });
  // }

  @On('donut_money_withdraw')
  async moneyWithdraw(@Ctx() ctx: DonutWithdrawContext) {
    return this.donutService.moneyWithdraw(ctx);
  }

  @On('donut_money_withdraw_error')
  moneyWithdrawError(@Ctx() ctx: DonutWithdrawContext) {
    return this.donutService.moneyWithdrawError(ctx);
  }
}

//   donut_subscription_create	Пользователь оформил подписку.
//   donut_subscription_prolonged	Пользователь продлил подписку.
//   donut_subscription_expired	Подписка пользователя истекла.
//   donut_subscription_cancelled	Пользователь отменил подписку.
//   subscription_price_changed	Изменилась стоимость подписки.
//   donut_money_withdraw	Руководитель сообщества вывел деньги.
//   donut_money_withdraw_error	Ошибка при выводе денег.
