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
import { FitnessClassService } from './fitness_class.service';
import { CreateFitnessClassDto } from './dto/create-fitness_class.dto';
import { UpdateFitnessClassDto } from './dto/update-fitness_class.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('fitness-class')
export class FitnessClassController {
  constructor(private readonly fitnessClassService: FitnessClassService) {}

  @Roles('admin', 'worker')
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
    return this.fitnessClassService.findOne(id);
  }

  @Roles('admin', 'worker')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFitnessClassDto: UpdateFitnessClassDto,
  ) {
    return this.fitnessClassService.update(id, updateFitnessClassDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fitnessClassService.remove(id);
  }
}