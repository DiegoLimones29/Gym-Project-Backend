import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseCatalog } from './entities/exercise_catalog.entity';
import { CreateExerciseCatalogDto } from './dto/create-exercise_catalog.dto';
import { UpdateExerciseCatalogDto } from './dto/update-exercise_catalog.dto';

@Injectable()
export class ExerciseCatalogService {
  constructor(
    @InjectRepository(ExerciseCatalog)
    private readonly exerciseRepo: Repository<ExerciseCatalog>,
  ) {}

  async create(dto: CreateExerciseCatalogDto) {
    const exercise = this.exerciseRepo.create(dto);
    const saved = await this.exerciseRepo.save(exercise);
    return { message: 'Ejercicio agregado al catálogo', data: saved };
  }

  async findAll() {
    const exercises = await this.exerciseRepo.find({
      order: { name: 'ASC' },
    });
    return { data: exercises };
  }

  async findOne(id: string) {
    const exercise = await this.exerciseRepo.findOneBy({ id });
    if (!exercise) {
      throw new NotFoundException(`Ejercicio ${id} no encontrado`);
    }
    return { data: exercise };
  }

  async update(id: string, dto: UpdateExerciseCatalogDto) {
    const exercise = await this.exerciseRepo.preload({ id, ...dto });
    if (!exercise) {
      throw new NotFoundException(`Ejercicio ${id} no encontrado`);
    }
    const saved = await this.exerciseRepo.save(exercise);
    return { message: 'Ejercicio actualizado', data: saved };
  }

  async remove(id: string) {
    const exercise = await this.exerciseRepo.findOneBy({ id });
    if (!exercise) {
      throw new NotFoundException(`Ejercicio ${id} no encontrado`);
    }
    await this.exerciseRepo.remove(exercise);
    return { message: 'Ejercicio eliminado' };
  }
}