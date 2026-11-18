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
@Roles('admin')
@Controller('worker-profile')
export class WorkerProfileController {
  constructor(private readonly workerProfileService: WorkerProfileService) {}

  @Post()
  create(@Body() dto: CreateWorkerProfileDto) {
    return this.workerProfileService.create(dto);
  }

  @Get()
  findAll() {
    return this.workerProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workerProfileService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWorkerProfileDto) {
    return this.workerProfileService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workerProfileService.remove(id);
  }
}
