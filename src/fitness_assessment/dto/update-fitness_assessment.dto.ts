import { PartialType } from '@nestjs/mapped-types';
import { CreateFitnessAssessmentDto } from './create-fitness_assessment.dto';

export class UpdateFitnessAssessmentDto extends PartialType(CreateFitnessAssessmentDto) {}
