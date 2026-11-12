import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FitnessAssessmentService } from './fitness_assessment.service';
import { CreateFitnessAssessmentDto } from './dto/create-fitness_assessment.dto';
import { UpdateFitnessAssessmentDto } from './dto/update-fitness_assessment.dto';

@Controller('fitness-assessment')
export class FitnessAssessmentController {
  constructor(private readonly fitnessAssessmentService: FitnessAssessmentService) {}

  @Post()
  create(@Body() createFitnessAssessmentDto: CreateFitnessAssessmentDto) {
    return this.fitnessAssessmentService.create(createFitnessAssessmentDto);
  }

  @Get()
  findAll() {
    return this.fitnessAssessmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fitnessAssessmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFitnessAssessmentDto: UpdateFitnessAssessmentDto) {
    return this.fitnessAssessmentService.update(+id, updateFitnessAssessmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fitnessAssessmentService.remove(+id);
  }
}
