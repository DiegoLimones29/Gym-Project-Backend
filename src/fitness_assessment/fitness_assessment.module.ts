import { Module } from '@nestjs/common';
import { FitnessAssessmentService } from './fitness_assessment.service';
import { FitnessAssessmentController } from './fitness_assessment.controller';

@Module({
  controllers: [FitnessAssessmentController],
  providers: [FitnessAssessmentService],
})
export class FitnessAssessmentModule {}
