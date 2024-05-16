import { Injectable, Logger } from '@nestjs/common';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';
import { VKChatsEnum } from '../common/config/vk.chats.config';
import { dateUtils } from '../common/utils/date.utils';
import { messageTagUtils } from '../common/utils/message.tag.utils';
import {
  OrganizationCreateDto,
  OrganizationCreateErrorDto,
  OrganizationPinNumberDto,
  OrganizationUpdateDto,
  OrganizationUpdateErrorDto,
} from '../operators/dto/organization.dto';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);
  constructor(@InjectVkApi() private readonly vk: VK) {}

  // todo написать соотбещния пол события создания организации, изменение организации и вывода ошибки в случае ошибки создания/изменения
  async notificationOrganizationCreate(parameters: OrganizationCreateDto) {
    try {
      const sendMessage = await this.vk.api.messages.send({
        message: `Создана новая организация в базе:
      \nИнформация:
      \nID: ${parameters.organization.id}
      \nНазвание: ${parameters.organization.name}
      \nФото: ${parameters.organization.photo}
      \nОписание: ${parameters.organization.description || 'Нет описания'}
      \nДата основания: ${dateUtils.getDateFormatNumber(parameters.organization.foundingDate)}
      \n\nВремя: ${dateUtils.getDateFormatNumber(parameters.date)}
      
      ${messageTagUtils.getTagOrganizationCreate(parameters.organization.id)}`,
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

  async notificationOrganizationUpdate(parameters: OrganizationUpdateDto) {
    try {
      const sendMessage = await this.vk.api.messages.send({
        message: `Обновлена организация в базе:
      \nИнформация:
      \nID: ${parameters.nextValue.id}
      \nНазвание: ${parameters.prevValue.name} -> ${parameters.nextValue.name}
      \nФото: ${parameters.prevValue.photo} -> ${parameters.nextValue.photo}
      \nОписание: ${parameters.prevValue.description || 'Нет описания'} ->  ${parameters.nextValue.description || 'Нет описания'}
      \nДата основания: ${dateUtils.getDateFormatNumber(parameters.prevValue.foundingDate)} -> ${dateUtils.getDateFormatNumber(parameters.nextValue.foundingDate)}
      \n\nВремя: ${dateUtils.getDateFormatNumber(parameters.date)}
      
      ${messageTagUtils.getTagOrganizationUpdate(parameters.nextValue.id)}`,
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

  async notificationOrganizationCreateError(
    parameters: OrganizationCreateErrorDto,
  ) {
    try {
      const sendMessage = await this.vk.api.messages.send({
        message: `Ошибка создания организации в базе:
        
      \nИнформация:
      \nПричина: ${parameters.message}
      \n\nВремя: ${dateUtils.getDateFormatNumber(parameters.date)}
      
      ${messageTagUtils.getTagOrganizationCreateError()}`,
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

  async notificationOrganizationUpdateError(
    parameters: OrganizationUpdateErrorDto,
  ) {
    try {
      const sendMessage = await this.vk.api.messages.send({
        message: `Ошибка обновления организации в базе:
        
      \nИнформация:
      \nID: ${parameters.organizationId}
      \nПричина: ${parameters.message}
      \n\nВремя: ${dateUtils.getDateFormatNumber(parameters.date)}
      
      ${messageTagUtils.getTagOrganizationUpdate(parameters.organizationId)}`,
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

  async notificationOrganizationPinNumber(
    parameters: OrganizationPinNumberDto,
  ) {
    try {
      const sendMessage = await this.vk.api.messages.send({
        message: `Прикреплен номер ${parameters.number.number} (ID: ${parameters.number.numberId}) к организации ${parameters.organization.name} (ID: ${parameters.organization.id}) (Название: ${parameters.organization.name})\n\nВремя: ${dateUtils.getDateFormatNumber(parameters.date)}\n\n${messageTagUtils.getTagNumber(parameters.number.number, parameters.number.numberId)} ${messageTagUtils.getTagOrganizationPinNumber(parameters.organization.id, parameters.number.numberId)}`,
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
