import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoutineExercise } from './entities/routine_exercise.entity';
import { CreateRoutineExerciseDto } from './dto/create-routine_exercise.dto';
import { UpdateRoutineExerciseDto } from './dto/update-routine_exercise.dto';

@Injectable()
export class RoutineExerciseService {
  constructor(
    @InjectRepository(RoutineExercise)
    private readonly routineRepo: Repository<RoutineExercise>,
  ) {}

  async create(dto: CreateRoutineExerciseDto) {
    const item = this.routineRepo.create(dto);
    const saved = await this.routineRepo.save(item);
    return { message: 'Ejercicio añadido a la rutina', data: saved };
  }

  async findAll() {
    const items = await this.routineRepo.find({
      relations: { exercise: true, workoutPlan: true },
      order: { orderIndex: 'ASC' },
    });
    return { data: items };
  }

  async findOne(id: string) {
    const item = await this.routineRepo.findOne({
      where: { id },
      relations: { exercise: true, workoutPlan: true },
    });
    if (!item) {
      throw new NotFoundException(`Ejercicio de rutina ${id} no encontrado`);
    }
    return { data: item };
  }

  async update(id: string, dto: UpdateRoutineExerciseDto) {
    const item = await this.routineRepo.preload({ id, ...dto });
    if (!item) {
      throw new NotFoundException(`Ejercicio de rutina ${id} no encontrado`);
    }
    const saved = await this.routineRepo.save(item);
    return { message: 'Ejercicio actualizado', data: saved };
  }

  async remove(id: string) {
    const item = await this.routineRepo.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Ejercicio de rutina ${id} no encontrado`);
    }
    await this.routineRepo.remove(item);
    return { message: 'Ejercicio quitado de la rutina' };
  }
}