import { Injectable } from '@nestjs/common';
import { CreateMembersProfileDto } from './dto/create-members_profile.dto';
import { UpdateMembersProfileDto } from './dto/update-members_profile.dto';

@Injectable()
export class MembersProfileService {
  create(createMembersProfileDto: CreateMembersProfileDto) {
    return 'This action adds a new membersProfile';
  }

  findAll() {
    return `This action returns all membersProfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} membersProfile`;
  }

  update(id: number, updateMembersProfileDto: UpdateMembersProfileDto) {
    return `This action updates a #${id} membersProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} membersProfile`;
  }
}
