import { Module } from '@nestjs/common';
import { RoutineExerciseService } from './routine_exercise.service';
import { RoutineExerciseController } from './routine_exercise.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutineExercise } from './entities/routine_exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoutineExercise])],
  controllers: [RoutineExerciseController],
  providers: [RoutineExerciseService],
})
export class RoutineExerciseModule {}
