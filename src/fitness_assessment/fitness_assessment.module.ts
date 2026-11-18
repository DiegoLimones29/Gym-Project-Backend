import { Module } from '@nestjs/common';
import { FitnessAssessmentService } from './fitness_assessment.service';
import { FitnessAssessmentController } from './fitness_assessment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FitnessAssessment } from './entities/fitness_assessment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FitnessAssessment])],
  controllers: [FitnessAssessmentController],
  providers: [FitnessAssessmentService],
})
export class FitnessAssessmentModule {}
