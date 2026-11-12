import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExerciseCatalogService } from './exercise_catalog.service';
import { CreateExerciseCatalogDto } from './dto/create-exercise_catalog.dto';
import { UpdateExerciseCatalogDto } from './dto/update-exercise_catalog.dto';

@Controller('exercise-catalog')
export class ExerciseCatalogController {
  constructor(private readonly exerciseCatalogService: ExerciseCatalogService) {}

  @Post()
  create(@Body() createExerciseCatalogDto: CreateExerciseCatalogDto) {
    return this.exerciseCatalogService.create(createExerciseCatalogDto);
  }

  @Get()
  findAll() {
    return this.exerciseCatalogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exerciseCatalogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExerciseCatalogDto: UpdateExerciseCatalogDto) {
    return this.exerciseCatalogService.update(+id, updateExerciseCatalogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exerciseCatalogService.remove(+id);
  }
}
