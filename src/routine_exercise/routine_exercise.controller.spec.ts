import { Test, TestingModule } from '@nestjs/testing';
import { RoutineExerciseController } from './routine_exercise.controller';
import { RoutineExerciseService } from './routine_exercise.service';

describe('RoutineExerciseController', () => {
  let controller: RoutineExerciseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoutineExerciseController],
      providers: [RoutineExerciseService],
    }).compile();

    controller = module.get<RoutineExerciseController>(RoutineExerciseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
