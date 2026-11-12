import { Module } from '@nestjs/common';
import { FitnessClassService } from './fitness_class.service';
import { FitnessClassController } from './fitness_class.controller';

@Module({
  controllers: [FitnessClassController],
  providers: [FitnessClassService],
})
export class FitnessClassModule {}
