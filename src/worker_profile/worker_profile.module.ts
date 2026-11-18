import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkerProfile } from './entities/worker_profile.entity';
import { WorkerProfileService } from './worker_profile.service';
import { WorkerProfileController } from './worker_profile.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkerProfile]), AuthModule],
  controllers: [WorkerProfileController],
  providers: [WorkerProfileService],
  exports: [WorkerProfileService],
})
export class WorkerProfileModule {}