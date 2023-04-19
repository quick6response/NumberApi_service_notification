import { Module } from '@nestjs/common';
import { ServerController } from './server.controller';
import { ServerNotificationService } from './server.notification.service';

@Module({
  providers: [ServerNotificationService],
  controllers: [ServerController],
})
export class ServerModule {}
