import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassSchedule } from './entities/class_schedule.entity';
import { CreateClassScheduleDto } from './dto/create-class_schedule.dto';
import { UpdateClassScheduleDto } from './dto/update-class_schedule.dto';

@Injectable()
export class ClassScheduleService {
  constructor(
    @InjectRepository(ClassSchedule)
    private readonly scheduleRepo: Repository<ClassSchedule>,
  ) {}

  async create(dto: CreateClassScheduleDto) {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (start < new Date()) {
      throw new BadRequestException(
        'No puedes programar una sesión en una fecha u hora pasada',
      );
    }

    if (end <= start) {
      throw new BadRequestException(
        'La hora de fin debe ser posterior a la hora de inicio',
      );
    }

    const schedule = this.scheduleRepo.create({
      classId: dto.classId,
      trainerId: dto.trainerId,
      roomName: dto.roomName,
      startTime: start,
      endTime: end,
      status: dto.status ?? 'scheduled',
    });

    const saved = await this.scheduleRepo.save(schedule);
    return { message: 'Horario programado correctamente', data: saved };
  }

  async findAll() {
    const schedules = await this.scheduleRepo.find({
      relations: {
        fitnessClass: true,
        trainer: true,
        classBookings: { member: true },
      },
      order: { startTime: 'ASC' },
    });
    return { data: schedules };
  }

  async findOne(id: string) {
    const schedule = await this.scheduleRepo.findOne({
      where: { id },
      relations: {
        fitnessClass: true,
        trainer: true,
        classBookings: { member: true },
      },
    });
    if (!schedule) {
      throw new NotFoundException(`Horario ${id} no encontrado`);
    }
    return { data: schedule };
  }

  async update(id: string, dto: UpdateClassScheduleDto) {
    const schedule = await this.scheduleRepo.preload({
      id,
      ...dto,
      ...(dto.startTime && { startTime: new Date(dto.startTime) }),
      ...(dto.endTime && { endTime: new Date(dto.endTime) }),
    });
    if (!schedule) {
      throw new NotFoundException(`Horario ${id} no encontrado`);
    }
    const saved = await this.scheduleRepo.save(schedule);
    return { message: 'Horario actualizado', data: saved };
  }

  async remove(id: string) {
    const schedule = await this.scheduleRepo.findOneBy({ id });
    if (!schedule) {
      throw new NotFoundException(`Horario ${id} no encontrado`);
    }
    await this.scheduleRepo.remove(schedule);
    return { message: 'Horario eliminado' };
  }
}