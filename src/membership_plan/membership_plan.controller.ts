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
import { MembershipPlanService } from './membership_plan.service';
import { CreateMembershipPlanDto } from './dto/create-membership_plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership_plan.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('membership-plan')
export class MembershipPlanController {
  constructor(private readonly membershipPlanService: MembershipPlanService) {}

  @Roles('admin')
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

  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMembershipPlanDto: UpdateMembershipPlanDto,
  ) {
    return this.membershipPlanService.update(+id, updateMembershipPlanDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membershipPlanService.remove(+id);
  }
}