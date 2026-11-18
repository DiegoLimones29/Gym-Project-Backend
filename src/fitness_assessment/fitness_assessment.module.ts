import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FitnessAssessment } from './entities/fitness_assessment.entity';
import { FitnessAssessmentService } from './fitness_assessment.service';
import { FitnessAssessmentController } from './fitness_assessment.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([FitnessAssessment]), AuthModule],
  controllers: [FitnessAssessmentController],
  providers: [FitnessAssessmentService],
  exports: [FitnessAssessmentService],
})
export class FitnessAssessmentModule {}