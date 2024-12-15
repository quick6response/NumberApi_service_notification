import { Injectable, Logger } from '@nestjs/common';
import { OperatorCreateDtoInterface } from 'microservice';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';

import { VKChatsEnum } from '../common/config/vk.chats.config';
import { dateUtils } from '../common/utils/date.utils';
import { messageTagUtils } from '../common/utils/message.tag.utils';

@Injectable()
export class OperatorsService {
  private readonly logger = new Logger(OperatorsService.name);
  constructor(@InjectVkApi() private readonly vk: VK) {}

  async notificationOperatorCreateAuto(dto: OperatorCreateDtoInterface) {
    try {
      const sendMessage = await this.vk.api.messages.send({
        message: `Создан новый оператор в базе:
      \n\nВремя: ${dateUtils.getDateFormatNumber(dto.date)}
      \n\nИнформация:
      \nID: ${dto.operator.id}
      \nНазвание: ${dto.operator.name}
      \nФото: ${dto.operator.photo}
      \nОписание: ${dto.operator.description || 'Нет описания'}
      \nДата основания: ${dto.operator.foundingDate !== null ? `${dateUtils.getDateFormatNumber(dto.operator.foundingDate)}` : 'Не указана'}
      
      
      ${messageTagUtils.getTagOperatorCreate(dto.operator.id)}`,
        chat_id: VKChatsEnum.LOGS_CHAT_DEV,
        random_id: getRandomId(),
      });

      return {
        result: true,
      };
    } catch (error) {
      this.logger.error(error);

      return {
        result: false,
      };
    }
  }
}
