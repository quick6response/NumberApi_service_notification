import { Test, TestingModule } from '@nestjs/testing';
import { NumbersController } from './numbers.controller';

describe('NumbersController', () => {
  let controller: NumbersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NumbersController],
    }).compile();

    controller = module.get<NumbersController>(NumbersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
