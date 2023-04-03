import { Injectable } from '@nestjs/common';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';
import { VKChatsEnum } from '../common/config/vk.chats.config';
import { dateUtils } from '../common/utils/date.utils';
import { VkService } from '../vk/vk.service';
import { NumberFindDto } from './dto/number.find.dto';

@Injectable()
export class NumbersService {
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
    private readonly vkHelpService: VkService,
  ) {}

  async getInfoNumber(parameters: NumberFindDto) {
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT,
      message: await this.getTextNumberInfo(parameters),
      random_id: getRandomId(),
      disable_mentions: true,
    });
    return { result: true };
  }

  private async getTextNumberInfo(parameters: NumberFindDto) {
    const user = await this.vkHelpService.getInfoUserVk(parameters.vk_user_id);
    return `@id${parameters.vk_user_id} (${user.first_name} ${
      user.last_name
    }) пробил номер ${this.convertToFormat(parameters.number)} (№${
      parameters.numberId
    }) ${parameters?.isUpdate ? '(Информация была обновлена)' : ''}

Время: ${dateUtils.getDateFormatNumber(parameters.date)}
IP: ${parameters.ip}

#number ${
      parameters?.isNewNumber ? '#number_new' : ''
    } #number${parameters.number} #id${parameters.vk_user_id}`;
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
