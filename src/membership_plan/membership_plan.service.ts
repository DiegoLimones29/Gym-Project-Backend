import { Injectable } from '@nestjs/common';
import { CreateMembershipPlanDto } from './dto/create-membership_plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership_plan.dto';

@Injectable()
export class MembershipPlanService {
  create(createMembershipPlanDto: CreateMembershipPlanDto) {
    return 'This action adds a new membershipPlan';
  }

  findAll() {
    return `This action returns all membershipPlan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} membershipPlan`;
  }

  update(id: number, updateMembershipPlanDto: UpdateMembershipPlanDto) {
    return `This action updates a #${id} membershipPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} membershipPlan`;
  }
}
