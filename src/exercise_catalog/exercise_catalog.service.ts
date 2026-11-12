import { Injectable } from '@nestjs/common';
import { CreateExerciseCatalogDto } from './dto/create-exercise_catalog.dto';
import { UpdateExerciseCatalogDto } from './dto/update-exercise_catalog.dto';

@Injectable()
export class ExerciseCatalogService {
  create(createExerciseCatalogDto: CreateExerciseCatalogDto) {
    return 'This action adds a new exerciseCatalog';
  }

  findAll() {
    return `This action returns all exerciseCatalog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exerciseCatalog`;
  }

  update(id: number, updateExerciseCatalogDto: UpdateExerciseCatalogDto) {
    return `This action updates a #${id} exerciseCatalog`;
  }

  remove(id: number) {
    return `This action removes a #${id} exerciseCatalog`;
  }
}
