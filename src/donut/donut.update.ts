import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import { Ctx, HearFallback, Hears, InjectVkApi, On, Update } from 'nestjs-vk';
import {
  DonutSubscriptionContext,
  DonutSubscriptionPriceContext,
  DonutWithdrawContext,
  MessageContext,
  VK,
} from 'vk-io';
import { VkExceptionFilter } from '../common/filters/vk-exception.filter';
import { VkAdminGuard } from '../common/guards/vk.admin.guard';
import { DonutVkService } from './service/donut.vk.service';

@Update()
@UseFilters(VkExceptionFilter)
export class DonutUpdate {
  private logger = new Logger(DonutUpdate.name);
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
    private readonly donutVkService: DonutVkService,
  ) {}

  @On('donut_subscription_create')
  create(@Ctx() ctx: DonutSubscriptionContext) {
    return this.donutVkService.create(ctx);
  }

  @Hears('donut_subscription_create')
  @UseGuards(VkAdminGuard)
  async donut_subscription_create(@Ctx() ctx: MessageContext) {
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

    return 'donut_subscription_create - ok';
  }

  @On('donut_subscription_prolonged')
  prolonged(@Ctx() ctx: DonutSubscriptionContext) {
    return this.donutVkService.prolonged(ctx);
  }

  @On('donut_subscription_expired')
  expired(@Ctx() ctx: DonutSubscriptionContext) {
    return this.donutVkService.expired(ctx);
  }

  @On('donut_subscription_cancelled')
  cancelled(@Ctx() ctx: DonutSubscriptionContext) {
    return this.donutVkService.cancelled(ctx);
  }

  @On('donut_subscription_price_changed')
  priceChanged(@Ctx() ctx: DonutSubscriptionPriceContext) {
    return this.donutVkService.priceChanged(ctx);
  }

  @On('donut_money_withdraw')
  async moneyWithdraw(@Ctx() ctx: DonutWithdrawContext) {
    return this.donutVkService.moneyWithdraw(ctx);
  }

  @On('donut_money_withdraw_error')
  moneyWithdrawError(@Ctx() ctx: DonutWithdrawContext) {
    return this.donutVkService.moneyWithdrawError(ctx);
  }

  @Hears('donut_money_withdraw_error')
  @UseGuards(VkAdminGuard)
  async donut_money_withdraw_error(@Ctx() ctx: MessageContext) {
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
