import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoutineExercise } from '../../routine_exercise/entities/routine_exercise.entity';

@Entity('workout_plans')
export class WorkoutPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'member_id', type: 'uuid' })
  memberId: string;

  @Column({ name: 'trainer_id', type: 'uuid' })
  trainerId: string;

  @Column()
  title: string;

  @Column()
  goal: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(
    () => RoutineExercise,
    (routineExercise) => routineExercise.workoutPlan,
  )
  routineExercises: RoutineExercise[];
}
