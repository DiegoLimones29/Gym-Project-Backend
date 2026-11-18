import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ExerciseCatalogService } from './exercise_catalog.service';
import { CreateExerciseCatalogDto } from './dto/create-exercise_catalog.dto';
import { UpdateExerciseCatalogDto } from './dto/update-exercise_catalog.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('exercise-catalog')
export class ExerciseCatalogController {
  constructor(
    private readonly exerciseCatalogService: ExerciseCatalogService,
  ) {}

  @Roles('admin', 'worker')
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
    return this.exerciseCatalogService.findOne(id);
  }

  @Roles('admin', 'worker')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExerciseCatalogDto: UpdateExerciseCatalogDto,
  ) {
    return this.exerciseCatalogService.update(id, updateExerciseCatalogDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exerciseCatalogService.remove(id);
  }
}