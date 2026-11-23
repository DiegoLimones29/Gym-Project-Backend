import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersClientService } from '../users-client/users-client.service';
import { CreateFitnessAssessmentDto } from './dto/create-fitness_assessment.dto';
import { UpdateFitnessAssessmentDto } from './dto/update-fitness_assessment.dto';
import { FitnessAssessment } from './entities/fitness_assessment.entity';

@Injectable()
export class FitnessAssessmentService {
  constructor(
    @InjectRepository(FitnessAssessment)
    private readonly assessmentRepo: Repository<FitnessAssessment>,
    private readonly usersClient: UsersClientService,
  ) {}

  async create(dto: CreateFitnessAssessmentDto) {
    await this.usersClient.assertUsersExist([dto.memberId, dto.workerId]);

    const assessment = this.assessmentRepo.create(dto);
    const saved = await this.assessmentRepo.save(assessment);
    return { message: 'Evaluación física registrada', data: saved };
  }

  async findAll() {
    const assessments = await this.assessmentRepo.find({
      order: { assessmentDate: 'DESC' },
    });
    const usersMap = await this.usersClient.findUsersByIds(
      assessments.flatMap((assessment) => [
        assessment.memberId,
        assessment.workerId,
      ]),
    );
    return {
      data: assessments.map((assessment) => ({
        ...assessment,
        member: usersMap.get(assessment.memberId) ?? null,
        worker: usersMap.get(assessment.workerId) ?? null,
      })),
    };
  }

  async findOne(id: string) {
    const assessment = await this.assessmentRepo.findOne({
      where: { id },
    });
    if (!assessment) {
      throw new NotFoundException(`Evaluación ${id} no encontrada`);
    }
    const usersMap = await this.usersClient.findUsersByIds([
      assessment.memberId,
      assessment.workerId,
    ]);
    return {
      data: {
        ...assessment,
        member: usersMap.get(assessment.memberId) ?? null,
        worker: usersMap.get(assessment.workerId) ?? null,
      },
    };
  }

  async update(id: string, dto: UpdateFitnessAssessmentDto) {
    const idsToCheck = [dto.memberId, dto.workerId].filter(
      (value): value is string => Boolean(value),
    );
    if (idsToCheck.length > 0) {
      await this.usersClient.assertUsersExist(idsToCheck);
    }

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
