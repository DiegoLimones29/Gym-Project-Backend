import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseCatalogController } from './exercise_catalog.controller';
import { ExerciseCatalogService } from './exercise_catalog.service';

describe('ExerciseCatalogController', () => {
  let controller: ExerciseCatalogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExerciseCatalogController],
      providers: [ExerciseCatalogService],
    }).compile();

    controller = module.get<ExerciseCatalogController>(ExerciseCatalogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
