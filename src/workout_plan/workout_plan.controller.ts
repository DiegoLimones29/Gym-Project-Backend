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
import { WorkoutPlanService } from './workout_plan.service';
import { CreateWorkoutPlanDto } from './dto/create-workout_plan.dto';
import { UpdateWorkoutPlanDto } from './dto/update-workout_plan.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('workout-plan')
export class WorkoutPlanController {
  constructor(private readonly workoutPlanService: WorkoutPlanService) {}

  @Roles('admin', 'worker')
  @Post()
  create(@Body() createWorkoutPlanDto: CreateWorkoutPlanDto) {
    return this.workoutPlanService.create(createWorkoutPlanDto);
  }

  @Get()
  findAll() {
    return this.workoutPlanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workoutPlanService.findOne(id);
  }

  @Roles('admin', 'worker')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkoutPlanDto: UpdateWorkoutPlanDto,
  ) {
    return this.workoutPlanService.update(id, updateWorkoutPlanDto);
  }

  @Roles('admin', 'worker')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workoutPlanService.remove(id);
  }
}