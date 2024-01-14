import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  @EventPattern()
  handleDefaultEvent(data: any) {
    // Логика обработки необработанных событий
    console.log('Handling default event:', data);
  }

  @MessagePattern()
  handleDefaultEvent1(data: any) {
    // Логика обработки необработанных событий
    console.log('Handling default event:', data);
  }
}
