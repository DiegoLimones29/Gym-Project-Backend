import { PartialType } from '@nestjs/mapped-types';
import { CreateMembersProfileDto } from './create-members_profile.dto';

export class UpdateMembersProfileDto extends PartialType(CreateMembersProfileDto) {}
