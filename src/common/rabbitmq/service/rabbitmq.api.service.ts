import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { rabbitNameConfig } from '../config/rabbit.name.config';
import { RabbitmqNotificationEventType } from '../types/rabbitmq.notification.events.type';

@Injectable()
// TODO написать верную реализацию и переименовать сервис, чтобы он отправлял события в главный сервис API, назвать его нужно как-то иначе, не DONUT, ибо эта штука может работать в разные стороны (возможно)
export class RabbitmqApiService {
  constructor(
    @Inject(rabbitNameConfig.SERVICE_API)
    private readonly client: ClientProxy,
  ) {}

  // TODO: Написать возвращаемые типы
  async send<
    K extends keyof RabbitmqNotificationEventType,
    V extends RabbitmqNotificationEventType[K],
  >(routingKey: K, message: V) {
    return this.client.send<K, V>(routingKey, {
      ...message,
      date: new Date().toString(),
    });
  }

  // Событие
  emit<
    K extends keyof RabbitmqNotificationEventType,
    V extends RabbitmqNotificationEventType[K],
  >(routingKey: K, message: V): Observable<K> {
    try {
      return this.client.emit<K, V>(routingKey, {
        ...message,
        date: new Date().toString(),
        time: Date.now(),
        messageId: Date.now(),
      });
    } catch (error) {
      console.error('ошибка отправки события в rabbitmq', error);
    }
  }
}
