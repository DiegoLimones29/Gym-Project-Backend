import { Module } from '@nestjs/common';
import { WorkerProfileService } from './worker_profile.service';
import { WorkerProfileController } from './worker_profile.controller';

@Module({
  controllers: [WorkerProfileController],
  providers: [WorkerProfileService],
})
export class WorkerProfileModule {}
