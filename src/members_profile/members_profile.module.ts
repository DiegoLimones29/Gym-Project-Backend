import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersProfile } from './entities/members_profile.entity';
import { MembersProfileService } from './members_profile.service';
import { MembersProfileController } from './members_profile.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([MembersProfile]), AuthModule],
  controllers: [MembersProfileController],
  providers: [MembersProfileService],
  exports: [MembersProfileService],
})
export class MembersProfileModule {}