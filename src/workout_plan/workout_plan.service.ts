import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutPlan } from './entities/workout_plan.entity';
import { CreateWorkoutPlanDto } from './dto/create-workout_plan.dto';
import { UpdateWorkoutPlanDto } from './dto/update-workout_plan.dto';

@Injectable()
export class WorkoutPlanService {
  constructor(
    @InjectRepository(WorkoutPlan)
    private readonly planRepo: Repository<WorkoutPlan>,
  ) {}

  async create(dto: CreateWorkoutPlanDto) {
    const plan = this.planRepo.create({
      ...dto,
      isActive: dto.isActive ?? true,
    });
    const saved = await this.planRepo.save(plan);
    return { message: 'Rutina creada correctamente', data: saved };
  }

  async findAll() {
    const plans = await this.planRepo.find({
      relations: {
        member: true,
        trainer: true,
        routineExercises: { exercise: true },
      },
      order: {
        createdAt: 'DESC',
        routineExercises: { orderIndex: 'ASC' },
      },
    });
    return { data: plans };
  }

  async findOne(id: string) {
    const plan = await this.planRepo.findOne({
      where: { id },
      relations: {
        member: true,
        trainer: true,
        routineExercises: { exercise: true },
      },
      order: {
        routineExercises: { orderIndex: 'ASC' },
      },
    });
    if (!plan) {
      throw new NotFoundException(`Rutina ${id} no encontrada`);
    }
    return { data: plan };
  }

  async update(id: string, dto: UpdateWorkoutPlanDto) {
    const plan = await this.planRepo.preload({ id, ...dto });
    if (!plan) {
      throw new NotFoundException(`Rutina ${id} no encontrada`);
    }
    const saved = await this.planRepo.save(plan);
    return { message: 'Rutina actualizada', data: saved };
  }

  async remove(id: string) {
    const plan = await this.planRepo.findOneBy({ id });
    if (!plan) {
      throw new NotFoundException(`Rutina ${id} no encontrada`);
    }
    await this.planRepo.remove(plan);
    return { message: 'Rutina eliminada' };
  }
}