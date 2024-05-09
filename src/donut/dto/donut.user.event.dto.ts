export class DonutUserSubscriptionIssuanceEventDto {
  userId: number;
  userVkId: number;
  // был ли пользователь в системе
  isUser: boolean;
  // дата начала подписки
  startDate?: number;
  // дата окончания подписки
  endDate?: number;
  // сумма подписки
  amount?: number;
  // цена подписки за месяц
  price?: number;
  //
  date: number;
}

export class DonutUserEventDto {
  // айди пользователя в сервисе
  userId: number;
  // айди пользователя вк
  userVkId: number;
  //
  date: number;
}
