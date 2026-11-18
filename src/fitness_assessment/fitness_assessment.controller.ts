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
import { FitnessAssessmentService } from './fitness_assessment.service';
import { CreateFitnessAssessmentDto } from './dto/create-fitness_assessment.dto';
import { UpdateFitnessAssessmentDto } from './dto/update-fitness_assessment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('fitness-assessment')
export class FitnessAssessmentController {
  constructor(
    private readonly fitnessAssessmentService: FitnessAssessmentService,
  ) {}

  @Roles('admin', 'worker')
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
    return this.fitnessAssessmentService.findOne(id);
  }

  @Roles('admin', 'worker')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFitnessAssessmentDto: UpdateFitnessAssessmentDto,
  ) {
    return this.fitnessAssessmentService.update(id, updateFitnessAssessmentDto);
  }

  @Roles('admin', 'worker')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fitnessAssessmentService.remove(id);
  }
}