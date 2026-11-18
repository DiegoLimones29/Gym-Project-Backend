import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassBooking } from './entities/class_booking.entity';
import { ClassSchedule } from '../class_schedule/entities/class_schedule.entity';
import { CreateClassBookingDto } from './dto/create-class_booking.dto';
import { UpdateClassBookingDto } from './dto/update-class_booking.dto';

@Injectable()
export class ClassBookingService {
  constructor(
    @InjectRepository(ClassBooking)
    private readonly bookingRepo: Repository<ClassBooking>,
    @InjectRepository(ClassSchedule)
    private readonly scheduleRepo: Repository<ClassSchedule>,
  ) {}

  async create(dto: CreateClassBookingDto) {
    const schedule = await this.scheduleRepo.findOne({
      where: { id: dto.classScheduleId },
      relations: { fitnessClass: true, classBookings: true },
    });

    if (!schedule) {
      throw new NotFoundException('Horario de clase no encontrado');
    }

    if (schedule.status !== 'scheduled') {
      throw new BadRequestException('Esta sesión ya no admite reservaciones');
    }

    const activeBookings = (schedule.classBookings ?? []).filter(
      (b) => b.bookingStatus === 'confirmed',
    );

    const capacity = schedule.fitnessClass?.capacity ?? 0;
    if (activeBookings.length >= capacity) {
      throw new BadRequestException('La clase ya alcanzó su cupo máximo');
    }

    // Verificar si ya existe registro previo por el @Unique(['memberId', 'classScheduleId'])
    const existing = await this.bookingRepo.findOne({
      where: {
        memberId: dto.memberId,
        classScheduleId: dto.classScheduleId,
      },
    });

    if (existing) {
      if (existing.bookingStatus === 'confirmed') {
        throw new ConflictException('El socio ya tiene reservado este horario');
      }
      existing.bookingStatus = 'confirmed';
      const reactivated = await this.bookingRepo.save(existing);
      return { message: 'Reservación reactivada', data: reactivated };
    }

    const booking = this.bookingRepo.create({
      classScheduleId: dto.classScheduleId,
      memberId: dto.memberId,
      bookingStatus: dto.bookingStatus ?? 'confirmed',
    });

    const saved = await this.bookingRepo.save(booking);
    return { message: 'Reservación confirmada', data: saved };
  }

  async findAll() {
    const bookings = await this.bookingRepo.find({
      relations: {
        member: true,
        classSchedule: { fitnessClass: true, trainer: true },
      },
      order: { bookedAt: 'DESC' },
    });
    return { data: bookings };
  }

  async findOne(id: string) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: {
        member: true,
        classSchedule: { fitnessClass: true, trainer: true },
      },
    });
    if (!booking) {
      throw new NotFoundException(`Reservación ${id} no encontrada`);
    }
    return { data: booking };
  }

  async update(id: string, dto: UpdateClassBookingDto) {
    const booking = await this.bookingRepo.preload({ id, ...dto });
    if (!booking) {
      throw new NotFoundException(`Reservación ${id} no encontrada`);
    }
    const saved = await this.bookingRepo.save(booking);
    return { message: 'Reservación actualizada', data: saved };
  }

  async remove(id: string) {
    const booking = await this.bookingRepo.findOneBy({ id });
    if (!booking) {
      throw new NotFoundException(`Reservación ${id} no encontrada`);
    }
    await this.bookingRepo.remove(booking);
    return { message: 'Reservación eliminada' };
  }
}