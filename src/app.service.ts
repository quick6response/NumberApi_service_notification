import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  listenUncaughtError(event: string) {
    process.on(event, (error) => {
      this.logger.error(error);
    });
  }
}
