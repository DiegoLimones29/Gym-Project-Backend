import { Module } from '@nestjs/common';
import { MembershipPlanService } from './membership_plan.service';
import { MembershipPlanController } from './membership_plan.controller';

@Module({
  controllers: [MembershipPlanController],
  providers: [MembershipPlanService],
})
export class MembershipPlanModule {}
