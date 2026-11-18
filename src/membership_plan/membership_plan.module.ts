import { Module } from '@nestjs/common';
import { MembershipPlanService } from './membership_plan.service';
import { MembershipPlanController } from './membership_plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipPlan } from './entities/membership_plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MembershipPlan])],
  controllers: [MembershipPlanController],
  providers: [MembershipPlanService],
})
export class MembershipPlanModule {}
