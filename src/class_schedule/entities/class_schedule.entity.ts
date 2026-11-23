import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClassBooking } from '../../class_booking/entities/class_booking.entity';
import { FitnessClass } from '../../fitness_class/entities/fitness_class.entity';

@Entity('class_schedules')
export class ClassSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'class_id', type: 'uuid' })
  classId: string;

  @Column({ name: 'trainer_id', type: 'uuid' })
  trainerId: string;

  @Column({ name: 'room_name' })
  roomName: string;

  @Column({ name: 'start_time', type: 'timestamptz' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamptz' })
  endTime: Date;

  @Column()
  status: string;

  @ManyToOne(() => FitnessClass, (fitnessClass) => fitnessClass.classSchedules)
  @JoinColumn({ name: 'class_id' })
  fitnessClass: FitnessClass;

  @OneToMany(() => ClassBooking, (classBooking) => classBooking.classSchedule)
  classBookings: ClassBooking[];
}
