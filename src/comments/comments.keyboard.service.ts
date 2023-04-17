import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Keyboard } from 'vk-io';

@Injectable()
export class CommentsKeyboardService {
  constructor(private readonly configService: ConfigService) {}
  getCommentNew() {
    const builder = Keyboard.keyboard([
      // Одна кнопка
      [
        Keyboard.applicationButton({
          label: 'Перейти в сервис',
          hash: 'admin/moderation',
          appId: this.configService.get<number>('APP_ID'),
        }),
      ],
    ]).inline();
    return builder;
  }
}
