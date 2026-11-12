import { Test, TestingModule } from '@nestjs/testing';
import { WorkerProfileController } from './worker_profile.controller';
import { WorkerProfileService } from './worker_profile.service';

describe('WorkerProfileController', () => {
  let controller: WorkerProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkerProfileController],
      providers: [WorkerProfileService],
    }).compile();

    controller = module.get<WorkerProfileController>(WorkerProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
