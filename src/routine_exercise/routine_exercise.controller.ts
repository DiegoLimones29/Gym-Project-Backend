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
import { RoutineExerciseService } from './routine_exercise.service';
import { CreateRoutineExerciseDto } from './dto/create-routine_exercise.dto';
import { UpdateRoutineExerciseDto } from './dto/update-routine_exercise.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('routine-exercise')
export class RoutineExerciseController {
  constructor(
    private readonly routineExerciseService: RoutineExerciseService,
  ) {}

  @Roles('admin', 'worker')
  @Post()
  create(@Body() createRoutineExerciseDto: CreateRoutineExerciseDto) {
    return this.routineExerciseService.create(createRoutineExerciseDto);
  }

  @Get()
  findAll() {
    return this.routineExerciseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routineExerciseService.findOne(id);
  }

  @Roles('admin', 'worker')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoutineExerciseDto: UpdateRoutineExerciseDto,
  ) {
    return this.routineExerciseService.update(id, updateRoutineExerciseDto);
  }

  @Roles('admin', 'worker')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routineExerciseService.remove(id);
  }
}