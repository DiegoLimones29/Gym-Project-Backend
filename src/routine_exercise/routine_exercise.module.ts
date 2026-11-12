import { Module } from '@nestjs/common';
import { RoutineExerciseService } from './routine_exercise.service';
import { RoutineExerciseController } from './routine_exercise.controller';

@Module({
  controllers: [RoutineExerciseController],
  providers: [RoutineExerciseService],
})
export class RoutineExerciseModule {}
