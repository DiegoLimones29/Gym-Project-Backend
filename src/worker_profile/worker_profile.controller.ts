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
import { WorkerProfileService } from './worker_profile.service';
import { CreateWorkerProfileDto } from './dto/create-worker_profile.dto';
import { UpdateWorkerProfileDto } from './dto/update-worker_profile.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('worker-profile')
export class WorkerProfileController {
  constructor(private readonly workerProfileService: WorkerProfileService) {}

  @Roles('admin')
  @Post()
  create(@Body() createWorkerProfileDto: CreateWorkerProfileDto) {
    return this.workerProfileService.create(createWorkerProfileDto);
  }

  @Roles('admin', 'worker')
  @Get()
  findAll() {
    return this.workerProfileService.findAll();
  }

  @Roles('admin', 'worker')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workerProfileService.findOne(id);
  }

  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkerProfileDto: UpdateWorkerProfileDto,
  ) {
    return this.workerProfileService.update(id, updateWorkerProfileDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workerProfileService.remove(id);
  }
}