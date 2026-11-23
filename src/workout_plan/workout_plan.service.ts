import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersClientService } from '../users-client/users-client.service';
import { CreateWorkoutPlanDto } from './dto/create-workout_plan.dto';
import { UpdateWorkoutPlanDto } from './dto/update-workout_plan.dto';
import { WorkoutPlan } from './entities/workout_plan.entity';

@Injectable()
export class WorkoutPlanService {
  constructor(
    @InjectRepository(WorkoutPlan)
    private readonly planRepo: Repository<WorkoutPlan>,
    private readonly usersClient: UsersClientService,
  ) {}

  async create(dto: CreateWorkoutPlanDto) {
    await this.usersClient.assertUsersExist([dto.memberId, dto.trainerId]);

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
        routineExercises: { exercise: true },
      },
      order: {
        createdAt: 'DESC',
        routineExercises: { orderIndex: 'ASC' },
      },
    });
    const usersMap = await this.usersClient.findUsersByIds(
      plans.flatMap((plan) => [plan.memberId, plan.trainerId]),
    );
    return {
      data: plans.map((plan) => ({
        ...plan,
        member: usersMap.get(plan.memberId) ?? null,
        trainer: usersMap.get(plan.trainerId) ?? null,
      })),
    };
  }

  async findOne(id: string) {
    const plan = await this.planRepo.findOne({
      where: { id },
      relations: {
        routineExercises: { exercise: true },
      },
      order: {
        routineExercises: { orderIndex: 'ASC' },
      },
    });
    if (!plan) {
      throw new NotFoundException(`Rutina ${id} no encontrada`);
    }
    const usersMap = await this.usersClient.findUsersByIds([
      plan.memberId,
      plan.trainerId,
    ]);
    return {
      data: {
        ...plan,
        member: usersMap.get(plan.memberId) ?? null,
        trainer: usersMap.get(plan.trainerId) ?? null,
      },
    };
  }

  async update(id: string, dto: UpdateWorkoutPlanDto) {
    const idsToCheck = [dto.memberId, dto.trainerId].filter(
      (value): value is string => Boolean(value),
    );
    if (idsToCheck.length > 0) {
      await this.usersClient.assertUsersExist(idsToCheck);
    }

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
