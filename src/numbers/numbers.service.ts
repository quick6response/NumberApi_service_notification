import { Injectable } from '@nestjs/common';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';
import { UsersUser } from 'vk-io/lib/api/schemas/objects';
import { VKChatsEnum } from '../common/config/vk.chats.config';
import { DateUtils } from '../common/utils/date.utils';
import { NumberFindDto } from './dto/number.find.dto';

@Injectable()
export class NumbersService {
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
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
    const user = await this.getInfoUserVk(parameters.vk_user_id);
    return `@id${parameters.vk_user_id} (${user.first_name} ${
      user.last_name
    }) пробил номер ${this.convertToFormat(parameters.number)} (№${
      parameters.numberId
    }) ${parameters?.isUpdate ? '(Информация о номере была обновлена)' : ''}

Время: ${DateUtils.getDateFormatNumber(parameters.date)}
IP: ${parameters.ip}

#number ${
      parameters?.isNewNumber ? '#number_new' : ''
    } #79194348991 #id778047801`;
  }
  private async getInfoUserVk(idVk: number): Promise<UsersUser> {
    const user = await this.vk.api.users.get({
      user_id: idVk,
    });
    return user[0];
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
