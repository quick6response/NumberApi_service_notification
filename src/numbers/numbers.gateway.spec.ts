import { Test, TestingModule } from '@nestjs/testing';
import { NumbersGateway } from './numbers.gateway';

describe('NumbersGateway', () => {
  let gateway: NumbersGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NumbersGateway],
    }).compile();

    gateway = module.get<NumbersGateway>(NumbersGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
