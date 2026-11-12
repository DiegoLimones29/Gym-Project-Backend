import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MembershipPlanService } from './membership_plan.service';
import { CreateMembershipPlanDto } from './dto/create-membership_plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership_plan.dto';

@Controller('membership-plan')
export class MembershipPlanController {
  constructor(private readonly membershipPlanService: MembershipPlanService) {}

  @Post()
  create(@Body() createMembershipPlanDto: CreateMembershipPlanDto) {
    return this.membershipPlanService.create(createMembershipPlanDto);
  }

  @Get()
  findAll() {
    return this.membershipPlanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membershipPlanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMembershipPlanDto: UpdateMembershipPlanDto) {
    return this.membershipPlanService.update(+id, updateMembershipPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membershipPlanService.remove(+id);
  }
}
