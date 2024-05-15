import { Injectable } from '@nestjs/common';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';
import { VKChatsEnum } from '../common/config/vk.chats.config';
import { dateUtils } from '../common/utils/date.utils';
import { OperatorCreateDto } from './dto/operator.create.dto';

@Injectable()
export class OperatorsService {
  constructor(@InjectVkApi() private readonly vk: VK) {}

  async notificationOperatorCreateAuto(parameters: OperatorCreateDto) {
    return this.vk.api.messages.send({
      message: `Создан новый оператор в базе:
      \n\nВремя: ${dateUtils.getDateFormatNumber(parameters.date)}
      \n\nИнформация:
      \nID: ${parameters.operator.id}
      \nНазвание: ${parameters.operator.name}
      \nФото: ${parameters.operator.photo}
      \nОписание: ${parameters.operator.description || 'Нет описания'}
      \nДата основания: ${dateUtils.getDateFormatNumber(parameters.operator.foundingDate)}
      `,
      chat_id: VKChatsEnum.LOGS_CHAT_DEV,
      random_id: getRandomId(),
    });
  }
}
