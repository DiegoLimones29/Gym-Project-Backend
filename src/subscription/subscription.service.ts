import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { MembershipPlan } from '../membership_plan/entities/membership_plan.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subRepo: Repository<Subscription>,
    @InjectRepository(MembershipPlan)
    private readonly planRepo: Repository<MembershipPlan>,
  ) {}

  async create(dto: CreateSubscriptionDto) {
    const existingActive = await this.subRepo.findOne({
      where: {
        memberId: dto.memberId,
        status: 'active',
      },
    });

    if (existingActive) {
      throw new ConflictException(
        'Este miembro ya tiene una suscripción activa. Cancélala o elimínala antes de asignar otro plan.',
      );
    }

    const plan = await this.planRepo.findOneBy({ id: dto.planId });
    if (!plan) {
      throw new NotFoundException(`Plan #${dto.planId} no encontrado`);
    }

    const start = dto.startDate ? new Date(dto.startDate) : new Date();
    const end = dto.endDate
      ? new Date(dto.endDate)
      : new Date(start.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

    const subscription = this.subRepo.create({
      memberId: dto.memberId,
      planId: dto.planId,
      startDate: start,
      endDate: end,
      status: dto.status ?? 'active',
    });

    const saved = await this.subRepo.save(subscription);
    return { message: 'Suscripción asignada correctamente', data: saved };
  }

  async findAll() {
    const subscriptions = await this.subRepo.find({
      relations: { user: true, membershipPlan: true },
      order: { createdAt: 'DESC' },
    });
    return { data: subscriptions };
  }

  async findOne(id: string) {
    const subscription = await this.subRepo.findOne({
      where: { id },
      relations: { user: true, membershipPlan: true },
    });
    if (!subscription) {
      throw new NotFoundException(`Suscripción ${id} no encontrada`);
    }
    return { data: subscription };
  }

  async update(id: string, dto: UpdateSubscriptionDto) {
    const subscription = await this.subRepo.preload({
      id,
      ...dto,
      ...(dto.startDate && { startDate: new Date(dto.startDate) }),
      ...(dto.endDate && { endDate: new Date(dto.endDate) }),
    });
    if (!subscription) {
      throw new NotFoundException(`Suscripción ${id} no encontrada`);
    }
    const saved = await this.subRepo.save(subscription);
    return { message: 'Suscripción actualizada', data: saved };
  }

  async remove(id: string) {
    const subscription = await this.subRepo.findOneBy({ id });
    if (!subscription) {
      throw new NotFoundException(`Suscripción ${id} no encontrada`);
    }
    await this.subRepo.remove(subscription);
    return { message: 'Suscripción eliminada' };
  }
}