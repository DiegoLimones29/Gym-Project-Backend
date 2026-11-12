import { Injectable } from '@nestjs/common';
import { CreateFitnessAssessmentDto } from './dto/create-fitness_assessment.dto';
import { UpdateFitnessAssessmentDto } from './dto/update-fitness_assessment.dto';

@Injectable()
export class FitnessAssessmentService {
  create(createFitnessAssessmentDto: CreateFitnessAssessmentDto) {
    return 'This action adds a new fitnessAssessment';
  }

  findAll() {
    return `This action returns all fitnessAssessment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fitnessAssessment`;
  }

  update(id: number, updateFitnessAssessmentDto: UpdateFitnessAssessmentDto) {
    return `This action updates a #${id} fitnessAssessment`;
  }

  remove(id: number) {
    return `This action removes a #${id} fitnessAssessment`;
  }
}
