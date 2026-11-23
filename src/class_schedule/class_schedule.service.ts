import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersClientService } from '../users-client/users-client.service';
import { CreateClassScheduleDto } from './dto/create-class_schedule.dto';
import { UpdateClassScheduleDto } from './dto/update-class_schedule.dto';
import { ClassSchedule } from './entities/class_schedule.entity';

@Injectable()
export class ClassScheduleService {
  constructor(
    @InjectRepository(ClassSchedule)
    private readonly scheduleRepo: Repository<ClassSchedule>,
    private readonly usersClient: UsersClientService,
  ) {}

  async create(dto: CreateClassScheduleDto) {
    await this.usersClient.assertUsersExist([dto.trainerId]);

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
        classBookings: true,
      },
      order: { startTime: 'ASC' },
    });

    const userIds = schedules.flatMap((schedule) => [
      schedule.trainerId,
      ...(schedule.classBookings ?? []).map((booking) => booking.memberId),
    ]);
    const usersMap = await this.usersClient.findUsersByIds(userIds);

    return {
      data: schedules.map((schedule) => ({
        ...schedule,
        trainer: usersMap.get(schedule.trainerId) ?? null,
        classBookings: (schedule.classBookings ?? []).map((booking) => ({
          ...booking,
          member: usersMap.get(booking.memberId) ?? null,
        })),
      })),
    };
  }

  async findOne(id: string) {
    const schedule = await this.scheduleRepo.findOne({
      where: { id },
      relations: {
        fitnessClass: true,
        classBookings: true,
      },
    });
    if (!schedule) {
      throw new NotFoundException(`Horario ${id} no encontrado`);
    }

    const userIds = [
      schedule.trainerId,
      ...(schedule.classBookings ?? []).map((booking) => booking.memberId),
    ];
    const usersMap = await this.usersClient.findUsersByIds(userIds);

    return {
      data: {
        ...schedule,
        trainer: usersMap.get(schedule.trainerId) ?? null,
        classBookings: (schedule.classBookings ?? []).map((booking) => ({
          ...booking,
          member: usersMap.get(booking.memberId) ?? null,
        })),
      },
    };
  }

  async update(id: string, dto: UpdateClassScheduleDto) {
    if (dto.trainerId) {
      await this.usersClient.assertUsersExist([dto.trainerId]);
    }

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
