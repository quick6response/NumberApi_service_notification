import { Injectable } from '@nestjs/common';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';
import { VKChatsEnum } from '../common/config/vk.chats.config';
import { dateUtils } from '../common/utils/date.utils';
import { ServerStartDto } from './dto/server.start.dto';
import { ServerStopDto } from './dto/server.stop.dto';

@Injectable()
export class ServerNotificationService {
  constructor(@InjectVkApi() private readonly vk: VK) {}
  async start(data: ServerStartDto) {
    return this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT_DEV,
      message: `Сервер API успешно запущен!\n
Время запуска: ${dateUtils.getDateFormatNumber(
        data.date,
      )}\nСейчас время: ${dateUtils.getDateFormatNumber(
        new Date().toString(),
      )}\n\n#server #server_start`,
      random_id: getRandomId(),
    });
  }

  async stop(data: ServerStopDto) {
    return this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT_DEV,
      message: `Сервер API был остановлен!\n
Время остановки: ${dateUtils.getDateFormatNumber(
        data.date,
      )}\nСейчас время: ${dateUtils.getDateFormatNumber(
        new Date().toString(),
      )}\nSignal: ${data.signal}\n\n#server #server_stop`,
      random_id: getRandomId(),
    });
  }
}
