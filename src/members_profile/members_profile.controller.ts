import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MembersProfileService } from './members_profile.service';
import { CreateMembersProfileDto } from './dto/create-members_profile.dto';
import { UpdateMembersProfileDto } from './dto/update-members_profile.dto';

@Controller('members-profile')
export class MembersProfileController {
  constructor(private readonly membersProfileService: MembersProfileService) {}

  @Post()
  create(@Body() createMembersProfileDto: CreateMembersProfileDto) {
    return this.membersProfileService.create(createMembersProfileDto);
  }

  @Get()
  findAll() {
    return this.membersProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersProfileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMembersProfileDto: UpdateMembersProfileDto) {
    return this.membersProfileService.update(+id, updateMembersProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersProfileService.remove(+id);
  }
}
