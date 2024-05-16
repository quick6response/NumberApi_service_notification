import { Injectable, Logger } from '@nestjs/common';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';
import { VKChatsEnum } from '../common/config/vk.chats.config';
import { dateUtils } from '../common/utils/date.utils';
import { messageTagUtils } from '../common/utils/message.tag.utils';
import { OperatorCreateDto } from '../organization/dto/operator.create.dto';

@Injectable()
export class OperatorsService {
  private readonly logger = new Logger(OperatorsService.name);
  constructor(@InjectVkApi() private readonly vk: VK) {}

  async notificationOperatorCreateAuto(parameters: OperatorCreateDto) {
    try {
      const sendMessage = await this.vk.api.messages.send({
        message: `Создан новый оператор в базе:
      \n\nВремя: ${dateUtils.getDateFormatNumber(parameters.date)}
      \n\nИнформация:
      \nID: ${parameters.operator.id}
      \nНазвание: ${parameters.operator.name}
      \nФото: ${parameters.operator.photo}
      \nОписание: ${parameters.operator.description || 'Нет описания'}
      \nДата основания: ${dateUtils.getDateFormatNumber(parameters.operator.foundingDate)}
      
      
      ${messageTagUtils.getTagOperatorCreate(parameters.operator.id)}`,
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
