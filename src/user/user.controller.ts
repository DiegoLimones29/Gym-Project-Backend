import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserCleanupService } from '../realtime/user-cleanup.service';
import { UsersClientService } from '../users-client/users-client.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly usersClient: UsersClientService,
    private readonly userCleanupService: UserCleanupService,
  ) {}

  @Roles('admin', 'worker')
  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Headers('authorization') authHeader?: string,
  ) {
    return this.usersClient.createUser(createUserDto, authHeader);
  }

  @Roles('admin', 'worker')
  @Get()
  findAll(@Headers('authorization') authHeader?: string) {
    return this.usersClient.findAllUsers(authHeader);
  }

  @Roles('admin', 'worker')
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Headers('authorization') authHeader?: string,
  ) {
    return this.usersClient.findOneUser(id, authHeader);
  }

  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Headers('authorization') authHeader?: string,
  ) {
    return this.usersClient.updateUser(id, updateUserDto, authHeader);
  }

  @Roles('admin')
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('authorization') authHeader?: string,
  ) {
    const response = await this.usersClient.removeUser(id, authHeader);
    await this.userCleanupService.cleanupForDeletedUser(id);
    return response;
  }
}
