import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembersProfile } from './entities/members_profile.entity';
import { CreateMembersProfileDto } from './dto/create-members_profile.dto';
import { UpdateMembersProfileDto } from './dto/update-members_profile.dto';

@Injectable()
export class MembersProfileService {
  constructor(
    @InjectRepository(MembersProfile)
    private readonly memberRepo: Repository<MembersProfile>,
  ) {}

  async create(dto: CreateMembersProfileDto) {
    const profile = this.memberRepo.create({
      ...dto,
      birthDate: new Date(dto.birthDate),
    });

    try {
      const saved = await this.memberRepo.save(profile);
      return { message: 'Perfil de miembro creado', data: saved };
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException(
          'El teléfono o el usuario ya tiene un perfil registrado',
        );
      }
      throw error;
    }
  }

  async findAll() {
    const profiles = await this.memberRepo.find({
      relations: { user: true },
    });
    return { data: profiles };
  }

  async findOne(id: string) {
    const profile = await this.memberRepo.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!profile) {
      throw new NotFoundException(`Perfil de miembro ${id} no encontrado`);
    }
    return { data: profile };
  }

  async update(id: string, dto: UpdateMembersProfileDto) {
    const profile = await this.memberRepo.preload({
      id,
      ...dto,
      ...(dto.birthDate && { birthDate: new Date(dto.birthDate) }),
    });
    if (!profile) {
      throw new NotFoundException(`Perfil de miembro ${id} no encontrado`);
    }
    const saved = await this.memberRepo.save(profile);
    return { message: 'Perfil actualizado', data: saved };
  }

  async remove(id: string) {
    const profile = await this.memberRepo.findOneBy({ id });
    if (!profile) {
      throw new NotFoundException(`Perfil de miembro ${id} no encontrado`);
    }
    await this.memberRepo.remove(profile);
    return { message: 'Perfil eliminado' };
  }
}