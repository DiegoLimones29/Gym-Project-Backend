import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ClassSchedule } from '../../class_schedule/entities/class_schedule.entity';

@Entity('class_bookings')
@Unique(['memberId', 'classScheduleId']) // pa q no haya pedos de bookings repetidas
export class ClassBooking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'class_schedule_id', type: 'uuid' })
  classScheduleId: string;

  @Column({ name: 'member_id', type: 'uuid' })
  memberId: string;

  @Column({ name: 'booking_status' })
  bookingStatus: string;

  @CreateDateColumn({ name: 'booked_at', type: 'timestamptz' })
  bookedAt: Date;

  @ManyToOne(
    () => ClassSchedule,
    (classSchedule) => classSchedule.classBookings,
  )
  @JoinColumn({ name: 'class_schedule_id' })
  classSchedule: ClassSchedule;
}
