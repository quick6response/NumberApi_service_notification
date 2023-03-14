import { Module } from '@nestjs/common';
import { NumbersController } from './numbers.controller';

@Module({
  controllers: [NumbersController],
})
export class NumbersModule {}
