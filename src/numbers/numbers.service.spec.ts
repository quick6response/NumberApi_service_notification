import { Test, TestingModule } from '@nestjs/testing';
import { NumbersService } from './numbers.service';

describe('NumbersService', () => {
  let service: NumbersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NumbersService],
    }).compile();

    service = module.get<NumbersService>(NumbersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
