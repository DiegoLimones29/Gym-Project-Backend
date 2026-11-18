import { Module } from '@nestjs/common';
import { MembersProfileService } from './members_profile.service';
import { MembersProfileController } from './members_profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersProfile } from './entities/members_profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MembersProfile])],
  controllers: [MembersProfileController],
  providers: [MembersProfileService],
})
export class MembersProfileModule {}
