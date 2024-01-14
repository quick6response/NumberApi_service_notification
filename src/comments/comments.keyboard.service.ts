import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Keyboard } from 'vk-io';

@Injectable()
export class CommentsKeyboardService {
  constructor(private readonly configService: ConfigService) {}
  getCommentNew(appId: number) {
    const builder = Keyboard.keyboard([
      // Одна кнопка
      [
        Keyboard.applicationButton({
          label: 'Перейти в сервис',
          hash: 'admin/moderation',
          appId: appId,
        }),
      ],
    ]).inline();
    return builder;
  }
}
