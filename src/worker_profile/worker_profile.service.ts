import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkerProfile } from './entities/worker_profile.entity';
import { CreateWorkerProfileDto } from './dto/create-worker_profile.dto';
import { UpdateWorkerProfileDto } from './dto/update-worker_profile.dto';

@Injectable()
export class WorkerProfileService {
  constructor(
    @InjectRepository(WorkerProfile)
    private readonly workerRepo: Repository<WorkerProfile>,
  ) {}

  async create(dto: CreateWorkerProfileDto) {
    const profile = this.workerRepo.create(dto);
    try {
      const saved = await this.workerRepo.save(profile);
      return { message: 'Perfil de trabajador creado', data: saved };
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException(
          'Este usuario ya tiene un perfil de trabajador',
        );
      }
      throw error;
    }
  }

  async findAll() {
    const profiles = await this.workerRepo.find({
      relations: { user: true },
    });
    return { data: profiles };
  }

  async findOne(id: string) {
    const profile = await this.workerRepo.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!profile) {
      throw new NotFoundException(`Perfil de trabajador ${id} no encontrado`);
    }
    return { data: profile };
  }

  async update(id: string, dto: UpdateWorkerProfileDto) {
    const profile = await this.workerRepo.preload({ id, ...dto });
    if (!profile) {
      throw new NotFoundException(`Perfil de trabajador ${id} no encontrado`);
    }
    const saved = await this.workerRepo.save(profile);
    return { message: 'Perfil actualizado', data: saved };
  }

  async remove(id: string) {
    const profile = await this.workerRepo.findOneBy({ id });
    if (!profile) {
      throw new NotFoundException(`Perfil de trabajador ${id} no encontrado`);
    }
    await this.workerRepo.remove(profile);
    return { message: 'Perfil eliminado' };
  }
}