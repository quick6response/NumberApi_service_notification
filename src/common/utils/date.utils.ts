export const dateUtils = {
  getDateFormatNumber: (
    date: string | number | Date,
    isSeconds = true,
  ): string => {
    return `${dateUtils.convertDateToFormat(
      date,
    )} в ${dateUtils.convertTimeToFormat(date, isSeconds)}`;
  },
  /**
   * Делаем из даты формат 04.01.2023
   * @param date
   */
  convertDateToFormat: (date: string | number | Date): string => {
    const inputDate = new Date(date);
    const dayInputDate = inputDate.getDate();
    const monthInputDate = inputDate.getMonth() + 1; // месяцы начинаются с 0
    const yearInputDate = inputDate.getFullYear();

    const convertDate: IConvertDate = {
      year: yearInputDate.toString(),
      day: dayInputDate.toString(),
      month: monthInputDate.toString(),
    };

    if (dayInputDate < 10) convertDate.day = '0' + dayInputDate;
    if (monthInputDate < 10) convertDate.month = '0' + monthInputDate;

    return `${convertDate.day}.${convertDate.month}.${convertDate.year}`;
  },
  /**
   * Приводим время к формату 06:01
   * @param date
   * @param isSeconds время с секундами
   */
  convertTimeToFormat: (
    date: string | number | Date,
    isSeconds = false,
  ): string => {
    const inputDate = new Date(date);
    const minutesInputDate = inputDate.getMinutes();
    const hoursInputDate = inputDate.getHours();
    const secondInputDate = inputDate.getSeconds();

    const convertTime: IConvertTime = {
      minutes: minutesInputDate.toString(),
      hours: hoursInputDate.toString(),
      seconds: secondInputDate.toString(),
    };

    if (hoursInputDate < 10) convertTime.hours = '0' + hoursInputDate;
    if (minutesInputDate < 10) convertTime.minutes = '0' + minutesInputDate;
    if (secondInputDate < 10) convertTime.seconds = '0' + secondInputDate;

    return `${convertTime.hours}:${convertTime.minutes}${
      isSeconds ? `:${convertTime.seconds}` : ''
    }`;
  },
};

interface IConvertDate {
  day: string;
  month: string;

  year: string;
}

interface IConvertTime {
  hours: string;
  minutes: string;
  seconds?: string;
}
