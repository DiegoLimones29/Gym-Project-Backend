import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepo.create(createRoleDto);
    return await this.roleRepo.save(role);
  }

  async findAll() {
    const roles = await this.roleRepo.find();
    return {
      message: 'roles',
      data: roles,
    };
  }

  async findOne(id: number) {
    const role = await this.roleRepo.findOneBy({ id });

    if (!role) {
      throw new NotFoundException(`Didnt find role with id ${id} nigga`);
    }

    return {
      message: 'role found',
      data: role,
    };
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {}

  async remove(id: number) {
    await this.findOne(id);
    await this.roleRepo.delete(id); 

    return {
      message: `Role with id ${id} had been deleted correctly nigga`
    }
  }
}
