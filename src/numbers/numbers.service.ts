import { Injectable } from '@nestjs/common';
import { ClientPlatform } from '@numberapi/microservices';
import {
  getClientInfoByPlatform,
  NumberScheduleUpdatedErrorDto,
  NumberScheduleUpdatedSuccessDto,
  NumberScheduleUpdatedSummaryDto,
  StatusFindNumber,
} from '@numberapi/microservices/notification';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';

import { VKChatsEnum } from '../common/config/vk.chats.config';
import { dateUtils } from '../common/utils/date.utils';
import { ErrorTransform } from '../common/utils/error.transform';
import { messageTagVkMiniAppsActionUtils } from '../common/utils/message.platform.tag.utils';
import { messageTagUtils } from '../common/utils/message.tag.utils';
import { VkService } from '../vk/vk.service';
import { NumberFindDto, NumberFindErrorDto } from './dto/number.find.dto';

@Injectable()
export class NumbersService {
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
    private readonly vkHelpService: VkService,
  ) {}

  async getInfoNumber(parameters: NumberFindDto) {
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT_DEV,
      message: await this.getTextNumberInfo(parameters),
      random_id: getRandomId(),
      disable_mentions: true,
    });
    return { result: true };
  }

  private geuTextRuStatusFindNumber(status: StatusFindNumber) {
    switch (status) {
      case StatusFindNumber.FIND:
        return 'Выполняется поиск в базе данных';
      case StatusFindNumber.CACHE:
        return 'Номер найден в кэше';
      case StatusFindNumber.CREATE:
        return 'Номер создан';
      case StatusFindNumber.UPDATE:
        return 'Номер обновлен';
    }
  }

  private async getTextNumberInfo(parameters: NumberFindDto) {
    if (parameters.clientPlatform === ClientPlatform.VK) {
      const { clientInfo } = getClientInfoByPlatform(
        parameters.clientPlatform,
        parameters.clientInfo,
      );
      const user = await this.vkHelpService.getInfoUserVk(
        clientInfo.vk_user_id,
      );

      return `@id${user.id} (${user.first_name} ${
        user.last_name
      }) пробил номер ${this.convertToFormat(parameters.number.number)} (№${
        parameters.number.numberId
      }) статус ${this.geuTextRuStatusFindNumber(parameters.status)}

Время: ${dateUtils.getDateFormatNumber(parameters.date)}
IP: ${clientInfo.ip}

${messageTagVkMiniAppsActionUtils.getTagPlatform()} ${messageTagUtils.getTagNumber(parameters.number.number, parameters.number.numberId)} ${messageTagUtils.getTagNumberFind(parameters.status)} ${messageTagVkMiniAppsActionUtils.getTagUserAction(parameters.user.userId, clientInfo.vk_user_id)}`;
    }
  }

  async numberFindError(parameters: NumberFindErrorDto) {
    if (parameters.clientPlatform === ClientPlatform.VK) {
      const { clientInfo } = getClientInfoByPlatform(
        parameters.clientPlatform,
        parameters.clientInfo,
      );
      await this.vk.api.messages.send({
        chat_id: VKChatsEnum.LOGS_CHAT_DEV,
        message: `@all Ошибка при поиске номера ${
          parameters.number.number
        }, стек ошибки: ${ErrorTransform.getMessage(parameters.errorText)}\n\n
${messageTagVkMiniAppsActionUtils.getTagPlatform()} ${messageTagUtils.getTagErrorNumber(parameters.number.number, parameters.number.numberId)} ${messageTagUtils.getTagNumberFind(parameters.status)} ${messageTagVkMiniAppsActionUtils.getTagUserAction(parameters.user.userId, clientInfo.vk_user_id)}`,
        random_id: getRandomId(),
        disable_mentions: true,
      });
      return { result: true };
    }
  }

  public async notificationNumberScheduleUpdateSuccess(
    data: NumberScheduleUpdatedSuccessDto,
  ): Promise<void> {
    const message = this.getNotificationNumberScheduleUpdateSuccessText(data);
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT_DEV,
      message: message,
      random_id: getRandomId(),
      disable_mentions: true,
    });
  }

  public async notificationNumberScheduleUpdateError(
    data: NumberScheduleUpdatedErrorDto,
  ): Promise<void> {
    const message = this.getNotificationNumberScheduleUpdateErrorText(data);
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT_DEV,
      message: message,
      random_id: getRandomId(),
      disable_mentions: true,
    });
  }

  async notificationNumberScheduleUpdateSummary(
    data: NumberScheduleUpdatedSummaryDto,
  ): Promise<void> {
    const message = this.getNotificationNumberScheduleUpdateSummaryText(data);
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT_DEV,
      message: message,
      random_id: getRandomId(),
      disable_mentions: true,
    });
  }

  private getNotificationNumberScheduleUpdateSuccessText({
    number,
    numberId,
  }: NumberScheduleUpdatedSuccessDto) {
    return `✅🤖 Произошло автоматическое обновление номера ${this.convertToFormat(number)}
  \n${messageTagUtils.getTagNumberScheduleUpdateSuccess(number, numberId)}`;
  }

  private getNotificationNumberScheduleUpdateErrorText({
    number,
    numberId,
    errorText,
    maxCountError,
    countError,
  }: NumberScheduleUpdatedErrorDto) {
    return `❌🤖 Не удалось автоматически обновить номер ${this.convertToFormat(number)}
\nПричина: ${errorText}
\nТекущее количество ошибок: ${countError} (максимум ${maxCountError})
\n${messageTagUtils.getTagNumberScheduleUpdateError(number, numberId)}`;
  }

  private getNotificationNumberScheduleUpdateSummaryText(
    data: NumberScheduleUpdatedSummaryDto,
  ): string {
    return `🤖 Сводка по обновлению номеров
\nВсего обработано номеров: ${data.totalProcessed}
Обновлено номеров: ${data.updatedCount}
Ошибок: ${data.errorCount}
Завершено: ${data.wasInterrupted ? 'Нет' : 'Да'}
\nВремя начала обновления: ${dateUtils.getDateFormatNumber(data.startDate)}
Время завершения обновления: ${dateUtils.getDateFormatNumber(data.endDate)}
\n${messageTagUtils.getTagNumberScheduleUpdateSummary()}`;
  }

  /**
   * Приводим номер к формату +7 (999) 676-65-63
   * @param number
   */
  convertToFormat(number: string) {
    return number
      .replace(/\D/g, '')
      .split(' ')
      .join('')
      .replace(/(\d)(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5'); // 7 (952) 123-12-64
  }
}
