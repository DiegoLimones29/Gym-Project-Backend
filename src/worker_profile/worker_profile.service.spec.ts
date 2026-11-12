import { Test, TestingModule } from '@nestjs/testing';
import { WorkerProfileService } from './worker_profile.service';

describe('WorkerProfileService', () => {
  let service: WorkerProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkerProfileService],
    }).compile();

    service = module.get<WorkerProfileService>(WorkerProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
