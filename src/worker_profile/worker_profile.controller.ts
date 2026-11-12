import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkerProfileService } from './worker_profile.service';
import { CreateWorkerProfileDto } from './dto/create-worker_profile.dto';
import { UpdateWorkerProfileDto } from './dto/update-worker_profile.dto';

@Controller('worker-profile')
export class WorkerProfileController {
  constructor(private readonly workerProfileService: WorkerProfileService) {}

  @Post()
  create(@Body() createWorkerProfileDto: CreateWorkerProfileDto) {
    return this.workerProfileService.create(createWorkerProfileDto);
  }

  @Get()
  findAll() {
    return this.workerProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workerProfileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkerProfileDto: UpdateWorkerProfileDto) {
    return this.workerProfileService.update(+id, updateWorkerProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workerProfileService.remove(+id);
  }
}
