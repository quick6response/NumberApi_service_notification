import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RabbitmqMainMessageKey } from '@quick_response/number_api_event/dist/_types';
import { RabbitmqMainMessages } from '@quick_response/number_api_event/dist/microservice/main/types/rabbitmq.events.data.type';
import { Observable } from 'rxjs';
import { rabbitNameConfig } from '../config/rabbit.name.config';

@Injectable()
export class RabbitmqApiMainService {
  constructor(
    @Inject(rabbitNameConfig.SERVICE_API)
    private readonly client: ClientProxy,
  ) {}

  // TODO: Написать возвращаемые типы
  send<K extends RabbitmqMainMessageKey, V extends RabbitmqMainMessages[K]>(
    routingKey: K,
    message: V,
  ) {
    return this.client.emit<K, V>(routingKey, {
      ...message,
      date: new Date().toString(),
    });
  }

  // Событие
  emit<K extends keyof RabbitmqMainMessages, V extends RabbitmqMainMessages[K]>(
    routingKey: K,
    message: V,
  ): Observable<K> {
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
