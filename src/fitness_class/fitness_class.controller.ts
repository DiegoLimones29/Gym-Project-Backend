import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FitnessClassService } from './fitness_class.service';
import { CreateFitnessClassDto } from './dto/create-fitness_class.dto';
import { UpdateFitnessClassDto } from './dto/update-fitness_class.dto';

@Controller('fitness-class')
export class FitnessClassController {
  constructor(private readonly fitnessClassService: FitnessClassService) {}

  @Post()
  create(@Body() createFitnessClassDto: CreateFitnessClassDto) {
    return this.fitnessClassService.create(createFitnessClassDto);
  }

  @Get()
  findAll() {
    return this.fitnessClassService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fitnessClassService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFitnessClassDto: UpdateFitnessClassDto) {
    return this.fitnessClassService.update(+id, updateFitnessClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fitnessClassService.remove(+id);
  }
}
