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
import { UsersClientService } from '../users-client/users-client.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly usersClient: UsersClientService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(
    @Body() createRoleDto: CreateRoleDto,
    @Headers('authorization') authHeader?: string,
  ) {
    return this.usersClient.createRole(createRoleDto, authHeader);
  }

  @Get()
  findAll() {
    return this.usersClient.findAllRoles();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersClient.findOneRole(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Headers('authorization') authHeader?: string,
  ) {
    return this.usersClient.updateRole(+id, updateRoleDto, authHeader);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Headers('authorization') authHeader?: string,
  ) {
    return this.usersClient.removeRole(+id, authHeader);
  }
}
