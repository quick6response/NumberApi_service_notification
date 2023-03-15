import { Module } from '@nestjs/common';
import { DonatService } from './donat.service';

@Module({
  providers: [DonatService],
})
export class DonatModule {}
