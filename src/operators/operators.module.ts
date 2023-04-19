import { Module } from '@nestjs/common';
import { OperatorsController } from './operators.controller';
import { OperatorsService } from './operators.service';

@Module({
  providers: [OperatorsService],
  controllers: [OperatorsController],
})
export class OperatorsModule {}
