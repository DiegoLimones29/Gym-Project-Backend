import { Module } from '@nestjs/common';
import { WorkerProfileService } from './worker_profile.service';
import { WorkerProfileController } from './worker_profile.controller';
import { WorkerProfile } from './entities/worker_profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([WorkerProfile])],
  controllers: [WorkerProfileController],
  providers: [WorkerProfileService],
})
export class WorkerProfileModule {}
