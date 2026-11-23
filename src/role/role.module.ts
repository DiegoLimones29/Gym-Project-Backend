import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RoleController } from './role.controller';

@Module({
  imports: [AuthModule],
  controllers: [RoleController],
})
export class RoleModule {}
