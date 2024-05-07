import { UseFilters, UseGuards } from '@nestjs/common';
import { Ctx, HearFallback, Hears, InjectVkApi, On, Update } from 'nestjs-vk';
import {
  DonutSubscriptionContext,
  DonutWithdrawContext,
  MessageContext,
  VK,
} from 'vk-io';
import { VkExceptionFilter } from '../common/filters/vk-exception.filter';
import { VkAdminGuard } from '../common/guards/vk.admin.guard';
import { DonutService } from './donut.service';

@Update()
@UseFilters(VkExceptionFilter)
export class DonutUpdate {
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
    private readonly donutService: DonutService,
  ) {}

  @On('donut_subscription_create')
  create(@Ctx() ctx: DonutSubscriptionContext) {
    return this.donutService.create(ctx);
  }

  @On('donut_subscription_prolonged')
  prolonged(@Ctx() ctx: DonutSubscriptionContext) {
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
  //
  // @On('donut_subscription_price_changed')
  // priceChanged(@Ctx() ctx: DonutSubscriptionPriceContext) {
  //   return this.donutService.subscriptionPriceChanged(ctx);
  // }

  @Hears('donut_money_withdraw_error')
  @UseGuards(VkAdminGuard)
  async donut_money_withdraw_error(@Ctx() ctx: MessageContext) {
    console.log(ctx);

    // @ts-ignore
    await this.moneyWithdrawError({
      payload: {
        reason: 'Денег нет, но вы держитесь!',
      },
      api: this.vk.api,
      get userId(): number {
        return ctx.senderId;
      },
      get amountWithoutFee(): number {
        return 56;
      },
      get isProlonged(): boolean {
        return true;
      },
      get amount(): number {
        return 59;
      },
      get isExpired(): boolean {
        return true;
      },
      get reason(): string {
        return 'Денег нет, но вы держитесь!';
      },
      get isCreated(): boolean {
        return false;
      },
      upload: this.vk.upload,
      state: {},
      type: 'donut_withdraw',
    });

    return 'donut_money_withdraw_error - ok';
  }

  @Hears('donut_subscription_create')
  @UseGuards(VkAdminGuard)
  async donut_subscription_create(@Ctx() ctx: MessageContext) {
    console.log(ctx);

    // @ts-ignore
    await this.create({
      payload: {
        amount: 1000000,
        amount_without_fee: 100000,
        user_id: 360767360,
      },
      api: this.vk.api,
      get userId(): number {
        return ctx.senderId;
      },
      toJSON(): object {
        return {
          amount: 1000000,
          amount_without_fee: 100000,
          user_id: 360767360,
        };
      },
      get amountWithoutFee(): number {
        return 1000000;
      },
      get isProlonged(): boolean {
        return true;
      },
      get amount(): number {
        return 1000000;
      },
      get isExpired(): boolean {
        return true;
      },
      get reason(): string {
        return 'Денег нет, но вы держитесь!';
      },
      get isCreated(): boolean {
        return false;
      },
      upload: this.vk.upload,
      state: {},
      type: 'donut_subscription',
    });

    return 'donut_money_withdraw_error - ok';
  }

  @On('donut_money_withdraw')
  async moneyWithdraw(@Ctx() ctx: DonutWithdrawContext) {
    return this.donutService.moneyWithdraw(ctx);
  }

  @On('donut_money_withdraw_error')
  moneyWithdrawError(@Ctx() ctx: DonutWithdrawContext) {
    return this.donutService.moneyWithdrawError(ctx);
  }

  @HearFallback()
  messageNew(@Ctx() ctx: MessageContext) {}
}

//   donut_subscription_create	Пользователь оформил подписку.
//   donut_subscription_prolonged	Пользователь продлил подписку.
//   donut_subscription_expired	Подписка пользователя истекла.
//   donut_subscription_cancelled	Пользователь отменил подписку.
//   subscription_price_changed	Изменилась стоимость подписки.
//   donut_money_withdraw	Руководитель сообщества вывел деньги.
//   donut_money_withdraw_error	Ошибка при выводе денег.
