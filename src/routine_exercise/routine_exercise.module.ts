import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutineExercise } from './entities/routine_exercise.entity';
import { RoutineExerciseService } from './routine_exercise.service';
import { RoutineExerciseController } from './routine_exercise.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoutineExercise]), AuthModule],
  controllers: [RoutineExerciseController],
  providers: [RoutineExerciseService],
  exports: [RoutineExerciseService],
})
export class RoutineExerciseModule {}