import { Module } from '@nestjs/common';
import { WorkoutPlanService } from './workout_plan.service';
import { WorkoutPlanController } from './workout_plan.controller';

@Module({
  controllers: [WorkoutPlanController],
  providers: [WorkoutPlanService],
})
export class WorkoutPlanModule {}
