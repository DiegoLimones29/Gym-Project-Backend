import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkoutPlanService } from './workout_plan.service';
import { CreateWorkoutPlanDto } from './dto/create-workout_plan.dto';
import { UpdateWorkoutPlanDto } from './dto/update-workout_plan.dto';

@Controller('workout-plan')
export class WorkoutPlanController {
  constructor(private readonly workoutPlanService: WorkoutPlanService) {}

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
    return this.workoutPlanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkoutPlanDto: UpdateWorkoutPlanDto) {
    return this.workoutPlanService.update(+id, updateWorkoutPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workoutPlanService.remove(+id);
  }
}
