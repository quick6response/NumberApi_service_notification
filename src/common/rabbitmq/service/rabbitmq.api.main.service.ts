import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { rabbitNameConfig } from '../config/rabbit.name.config';
import { RabbitmqApiSendEventsType } from '../types/rabbitmq.api.send.events.type';

@Injectable()
export class RabbitmqApiMainService {
  constructor(
    @Inject(rabbitNameConfig.SERVICE_API)
    private readonly client: ClientProxy,
  ) {}

  // TODO: Написать возвращаемые типы
  async send<
    K extends keyof RabbitmqApiSendEventsType,
    V extends RabbitmqApiSendEventsType[K],
  >(routingKey: K, message: V) {
    return this.client.send<K, V>(routingKey, {
      ...message,
      date: new Date().toString(),
    });
  }

  // Событие
  emit<
    K extends keyof RabbitmqApiSendEventsType,
    V extends RabbitmqApiSendEventsType[K],
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
