import { Injectable } from '@nestjs/common';
import { CreateRoutineExerciseDto } from './dto/create-routine_exercise.dto';
import { UpdateRoutineExerciseDto } from './dto/update-routine_exercise.dto';

@Injectable()
export class RoutineExerciseService {
  create(createRoutineExerciseDto: CreateRoutineExerciseDto) {
    return 'This action adds a new routineExercise';
  }

  findAll() {
    return `This action returns all routineExercise`;
  }

  findOne(id: number) {
    return `This action returns a #${id} routineExercise`;
  }

  update(id: number, updateRoutineExerciseDto: UpdateRoutineExerciseDto) {
    return `This action updates a #${id} routineExercise`;
  }

  remove(id: number) {
    return `This action removes a #${id} routineExercise`;
  }
}
