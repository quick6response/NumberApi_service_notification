import { Test, TestingModule } from '@nestjs/testing';

import { ServerNotificationService } from './server.notification.service';

describe('ServerService', () => {
  let service: ServerNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerNotificationService],
    }).compile();

    service = module.get<ServerNotificationService>(ServerNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
