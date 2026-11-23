import { Global, Module } from '@nestjs/common';
import { UsersClientService } from './users-client.service';

@Global()
@Module({
  providers: [UsersClientService],
  exports: [UsersClientService],
})
export class UsersClientModule {}
