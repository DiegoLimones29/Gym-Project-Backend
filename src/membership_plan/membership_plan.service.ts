import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembershipPlan } from './entities/membership_plan.entity';
import { CreateMembershipPlanDto } from './dto/create-membership_plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership_plan.dto';

@Injectable()
export class MembershipPlanService {
  constructor(
    @InjectRepository(MembershipPlan)
    private readonly planRepo: Repository<MembershipPlan>,
  ) {}

  async create(dto: CreateMembershipPlanDto) {
    const plan = this.planRepo.create(dto);
    const saved = await this.planRepo.save(plan);
    return { message: 'Plan creado correctamente', data: saved };
  }

  async findAll() {
    const plans = await this.planRepo.find({
      order: { price: 'ASC' },
    });
    return { data: plans };
  }

  async findOne(id: number) {
    const plan = await this.planRepo.findOneBy({ id });
    if (!plan) {
      throw new NotFoundException(`Plan #${id} no encontrado`);
    }
    return { data: plan };
  }

  async update(id: number, dto: UpdateMembershipPlanDto) {
    const plan = await this.planRepo.preload({ id, ...dto });
    if (!plan) {
      throw new NotFoundException(`Plan #${id} no encontrado`);
    }
    const saved = await this.planRepo.save(plan);
    return { message: 'Plan actualizado', data: saved };
  }

  async remove(id: number) {
    const plan = await this.planRepo.findOneBy({ id });
    if (!plan) {
      throw new NotFoundException(`Plan #${id} no encontrado`);
    }
    await this.planRepo.remove(plan);
    return { message: 'Plan eliminado' };
  }
}