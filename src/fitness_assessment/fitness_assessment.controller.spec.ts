import { Test, TestingModule } from '@nestjs/testing';
import { FitnessAssessmentController } from './fitness_assessment.controller';
import { FitnessAssessmentService } from './fitness_assessment.service';

describe('FitnessAssessmentController', () => {
  let controller: FitnessAssessmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FitnessAssessmentController],
      providers: [FitnessAssessmentService],
    }).compile();

    controller = module.get<FitnessAssessmentController>(FitnessAssessmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
