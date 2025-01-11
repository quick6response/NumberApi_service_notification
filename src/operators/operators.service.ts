import { Injectable, Logger } from '@nestjs/common';
import {
  OperatorCreateDtoInterface,
  OperatorBindIntegrationDtoInterface,
} from '@numberapi/microservices/notification';
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
      await this.vk.api.messages.send({
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
    } catch (error) {
      this.logger.error(error);
    }
  }

  async notificationOperatorBindIntegration(
    dto: OperatorBindIntegrationDtoInterface,
  ) {
    try {
      await this.vk.api.messages.send({
        message: `
К оператору ${dto.operator.name} успешно привязан оператор из интеграции.

Информация об операторе:
ID: ${dto.operator.id}
Название: ${dto.operator.name}
Интеграция: ${dto.integrationId}

Время: ${dateUtils.getDateFormatNumber(dto.date)}

${messageTagUtils.getTagOperatorBindIntegration(dto.operator.id, dto.integrationId)}
`,
        chat_id: VKChatsEnum.LOGS_CHAT_DEV,
        random_id: getRandomId(),
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
