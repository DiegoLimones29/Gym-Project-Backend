import { PartialType } from '@nestjs/mapped-types';
import { CreateMembershipPlanDto } from './create-membership_plan.dto';

export class UpdateMembershipPlanDto extends PartialType(CreateMembershipPlanDto) {}
