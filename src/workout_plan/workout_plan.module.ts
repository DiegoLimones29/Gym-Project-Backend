import { Module } from '@nestjs/common';
import { WorkoutPlanService } from './workout_plan.service';
import { WorkoutPlanController } from './workout_plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutPlan } from './entities/workout_plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutPlan])],
  controllers: [WorkoutPlanController],
  providers: [WorkoutPlanService],
})
export class WorkoutPlanModule {}
