import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseCatalogService } from './exercise_catalog.service';

describe('ExerciseCatalogService', () => {
  let service: ExerciseCatalogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExerciseCatalogService],
    }).compile();

    service = module.get<ExerciseCatalogService>(ExerciseCatalogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
