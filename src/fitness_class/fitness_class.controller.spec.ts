import { Test, TestingModule } from '@nestjs/testing';
import { FitnessClassController } from './fitness_class.controller';
import { FitnessClassService } from './fitness_class.service';

describe('FitnessClassController', () => {
  let controller: FitnessClassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FitnessClassController],
      providers: [FitnessClassService],
    }).compile();

    controller = module.get<FitnessClassController>(FitnessClassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
