import { Test, TestingModule } from '@nestjs/testing';
import { FitnessAssessmentService } from './fitness_assessment.service';

describe('FitnessAssessmentService', () => {
  let service: FitnessAssessmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FitnessAssessmentService],
    }).compile();

    service = module.get<FitnessAssessmentService>(FitnessAssessmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
