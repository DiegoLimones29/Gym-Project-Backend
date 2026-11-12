import { Module } from '@nestjs/common';
import { MembersProfileService } from './members_profile.service';
import { MembersProfileController } from './members_profile.controller';

@Module({
  controllers: [MembersProfileController],
  providers: [MembersProfileService],
})
export class MembersProfileModule {}
