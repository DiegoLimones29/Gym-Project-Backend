import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutPlan } from './entities/workout_plan.entity';
import { WorkoutPlanService } from './workout_plan.service';
import { WorkoutPlanController } from './workout_plan.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutPlan]), AuthModule],
  controllers: [WorkoutPlanController],
  providers: [WorkoutPlanService],
  exports: [WorkoutPlanService],
})
export class WorkoutPlanModule {}