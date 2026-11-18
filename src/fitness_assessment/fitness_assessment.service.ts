import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FitnessAssessment } from './entities/fitness_assessment.entity';
import { CreateFitnessAssessmentDto } from './dto/create-fitness_assessment.dto';
import { UpdateFitnessAssessmentDto } from './dto/update-fitness_assessment.dto';

@Injectable()
export class FitnessAssessmentService {
  constructor(
    @InjectRepository(FitnessAssessment)
    private readonly assessmentRepo: Repository<FitnessAssessment>,
  ) {}

  async create(dto: CreateFitnessAssessmentDto) {
    const assessment = this.assessmentRepo.create(dto);
    const saved = await this.assessmentRepo.save(assessment);
    return { message: 'Evaluación física registrada', data: saved };
  }

  async findAll() {
    const assessments = await this.assessmentRepo.find({
      relations: { member: true, worker: true },
      order: { assessmentDate: 'DESC' },
    });
    return { data: assessments };
  }

  async findOne(id: string) {
    const assessment = await this.assessmentRepo.findOne({
      where: { id },
      relations: { member: true, worker: true },
    });
    if (!assessment) {
      throw new NotFoundException(`Evaluación ${id} no encontrada`);
    }
    return { data: assessment };
  }

  async update(id: string, dto: UpdateFitnessAssessmentDto) {
    const assessment = await this.assessmentRepo.preload({ id, ...dto });
    if (!assessment) {
      throw new NotFoundException(`Evaluación ${id} no encontrada`);
    }
    const saved = await this.assessmentRepo.save(assessment);
    return { message: 'Evaluación actualizada', data: saved };
  }

  async remove(id: string) {
    const assessment = await this.assessmentRepo.findOneBy({ id });
    if (!assessment) {
      throw new NotFoundException(`Evaluación ${id} no encontrada`);
    }
    await this.assessmentRepo.remove(assessment);
    return { message: 'Evaluación eliminada' };
  }
}