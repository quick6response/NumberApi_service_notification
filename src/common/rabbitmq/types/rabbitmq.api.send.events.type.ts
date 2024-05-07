// события, которые можно отправить в главный сервис
export type RabbitmqApiSendEventsType = {
  // #startReginon Donut
  // созданана подписка
  ['donut.create']: {
    userId: number;
    amount: number;
    amountWithoutFee: number;
    json: object;
  };
  // продлена подписка
  ['donut.prolonged']: { userId: number; json: object };
  // истекла подписка (не продлили)
  ['donut.expired']: { userId: number; json: object };
  // отменена подписка (но еще действует)
  ['donut.cancelled']: { userId: number; json: object };
  // изменена цена
  ['donut.subscriptionPriceChanged']: { userId: number; json: object };
  // #endRegion Donut
};
