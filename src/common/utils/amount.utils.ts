const intl = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
});

export class AmountUtils {
  getFormatAmountRUB(amount: number): string {
    return intl.format(amount);
  }
}

export const amountUtils = new AmountUtils();
