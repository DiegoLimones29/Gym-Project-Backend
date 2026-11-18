import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FitnessClass } from './entities/fitness_class.entity';
import { CreateFitnessClassDto } from './dto/create-fitness_class.dto';
import { UpdateFitnessClassDto } from './dto/update-fitness_class.dto';

@Injectable()
export class FitnessClassService {
  constructor(
    @InjectRepository(FitnessClass)
    private readonly classRepo: Repository<FitnessClass>,
  ) {}

  async create(dto: CreateFitnessClassDto) {
    const fitnessClass = this.classRepo.create({
      ...dto,
      isActive: dto.isActive ?? true,
    });
    const saved = await this.classRepo.save(fitnessClass);
    return { message: 'Clase creada correctamente', data: saved };
  }

  async findAll() {
    const classes = await this.classRepo.find({
      order: { createdAt: 'DESC' },
    });
    return { data: classes };
  }

  async findOne(id: string) {
    const fitnessClass = await this.classRepo.findOneBy({ id });
    if (!fitnessClass) {
      throw new NotFoundException(`Clase ${id} no encontrada`);
    }
    return { data: fitnessClass };
  }

  async update(id: string, dto: UpdateFitnessClassDto) {
    const fitnessClass = await this.classRepo.preload({ id, ...dto });
    if (!fitnessClass) {
      throw new NotFoundException(`Clase ${id} no encontrada`);
    }
    const saved = await this.classRepo.save(fitnessClass);
    return { message: 'Clase actualizada', data: saved };
  }

  async remove(id: string) {
    const fitnessClass = await this.classRepo.findOneBy({ id });
    if (!fitnessClass) {
      throw new NotFoundException(`Clase ${id} no encontrada`);
    }
    await this.classRepo.remove(fitnessClass);
    return { message: 'Clase eliminada' };
  }
}