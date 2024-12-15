import { Injectable } from '@nestjs/common';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';

import { ServerStartDto } from './dto/server.start.dto';
import { ServerStopDto } from './dto/server.stop.dto';
import { VKChatsEnum } from '../common/config/vk.chats.config';
import { dateUtils } from '../common/utils/date.utils';

@Injectable()
export class ServerNotificationService {
  constructor(@InjectVkApi() private readonly vk: VK) {}

  async start(message: ServerStartDto) {
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT_DEV,
      message: `Сервер API успешно запущен!
      \nВремя запуска: ${dateUtils.getDateFormatNumber(message.date)}
      \nСейчас время: ${dateUtils.getDateFormatNumber(new Date().toString())}
      \n#server #server_start`,
      random_id: getRandomId(),
    });
  }

  async stop(data: ServerStopDto) {
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT_DEV,
      message: `Сервер API был остановлен!
      \nВремя остановки: ${dateUtils.getDateFormatNumber(data.date)}
      \nСейчас время: ${dateUtils.getDateFormatNumber(new Date().toString())}
      \nSignal: ${data.signal}
      \n\n#server #server_stop`,
      random_id: getRandomId(),
    });
  }
}
