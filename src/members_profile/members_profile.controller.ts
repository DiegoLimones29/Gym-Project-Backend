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
import { MembersProfileService } from './members_profile.service';
import { CreateMembersProfileDto } from './dto/create-members_profile.dto';
import { UpdateMembersProfileDto } from './dto/update-members_profile.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('members-profile')
export class MembersProfileController {
  constructor(private readonly membersProfileService: MembersProfileService) {}

  @Roles('admin', 'worker')
  @Post()
  create(@Body() dto: CreateMembersProfileDto) {
    return this.membersProfileService.create(dto);
  }

  @Roles('admin', 'worker')
  @Get()
  findAll() {
    return this.membersProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersProfileService.findOne(id);
  }

  @Roles('admin', 'worker')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMembersProfileDto) {
    return this.membersProfileService.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersProfileService.remove(id);
  }
}