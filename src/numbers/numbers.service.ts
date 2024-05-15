import { Injectable } from '@nestjs/common';
import {
  ClientPlatformEnum,
  getClientInfoByPlatform,
  StatusFindNumber,
} from '@quick_response/number_api_event';
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
    if (parameters.clientPlatform === ClientPlatformEnum.VK) {
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

${messageTagVkMiniAppsActionUtils.getTagPlatform()} ${messageTagUtils.getTagNumber(parameters.number.number, parameters.number.numberId)} ${messageTagUtils.getTagNumberFind(parameters.status)} ${messageTagVkMiniAppsActionUtils.getTagUserAction(parameters.user.id, parameters.user.idVk)}`;
    }
  }

  async numberFindError(parameters: NumberFindErrorDto) {
    if (parameters.clientPlatform === ClientPlatformEnum.VK) {
      await this.vk.api.messages.send({
        chat_id: VKChatsEnum.LOGS_CHAT_DEV,
        message: `Ошибка при поиске номера ${
          parameters.number
        }, стек ошибки: ${ErrorTransform.getMessage(parameters.errorText)}\n\n
${messageTagVkMiniAppsActionUtils.getTagPlatform()} ${messageTagUtils.getTagErrorNumber(parameters.number.number, parameters.number.numberId)} ${messageTagUtils.getTagNumberFind(parameters.status)} ${messageTagVkMiniAppsActionUtils.getTagUserAction(parameters.user.id, parameters.user.idVk)}`,
        random_id: getRandomId(),
        disable_mentions: true,
      });
      return { result: true };
    }
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
