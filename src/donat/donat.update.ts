import { Ctx, InjectVkApi, On, Update } from 'nestjs-vk';
import { DonutSubscriptionContext, VK } from 'vk-io';

@Update()
export class DonatUpdate {
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
  ) {}

  @On('donut_subscription_create')
  create(@Ctx() ctx: DonutSubscriptionContext) {
    console.log(ctx);
  }

  @On('donut_subscription_prolonged')
  prolonged(@Ctx() ctx: DonutSubscriptionContext) {
    console.log(ctx);
  }

  @On('donut_subscription_expired')
  expired(@Ctx() ctx: DonutSubscriptionContext) {
    console.log(ctx);
  }

  @On('donut_subscription_cancelled')
  cancelled(@Ctx() ctx: DonutSubscriptionContext) {
    console.log(ctx);
  }

  @On('donut_money_withdraw')
  moneyWithdraw(@Ctx() ctx: DonutSubscriptionContext) {
    console.log(ctx);
  }

  @On('donut_money_withdraw_error')
  moneyWithdrawError(@Ctx() ctx: { reason: string }) {
    console.log(ctx);
  }
}

//   donut_subscription_create	Пользователь оформил подписку.
//   donut_subscription_prolonged	Пользователь продлил подписку.
//   donut_subscription_expired	Подписка пользователя истекла.
//   donut_subscription_cancelled	Пользователь отменил подписку.
//   subscription_price_changed	Изменилась стоимость подписки.
//   donut_money_withdraw	Руководитель сообщества вывел деньги.
//   donut_money_withdraw_error	Ошибка при выводе денег.
