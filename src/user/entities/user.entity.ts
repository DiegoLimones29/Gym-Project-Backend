import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { WorkerProfile } from '../../worker_profile/entities/worker_profile.entity';
import { MembersProfile } from '../../members_profile/entities/members_profile.entity';
import { Subscription } from '../../subscription/entities/subscription.entity';
import { FitnessAssessment } from '../../fitness_assessment/entities/fitness_assessment.entity';
import { ClassSchedule } from '../../class_schedule/entities/class_schedule.entity';
import { ClassBooking } from '../../class_booking/entities/class_booking.entity';
import { WorkoutPlan } from '../../workout_plan/entities/workout_plan.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'role_id' })
  roleId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToOne(() => WorkerProfile, (workerProfile) => workerProfile.user) //relacion worker profile
  workerProfile?: WorkerProfile;

  @OneToOne(() => MembersProfile, (membersProfile) => membersProfile.user) //necesito entender esta puta sintaxis
  memberProfile?: MembersProfile; //relacion member profail

  @OneToMany(() => Subscription, (subscription) => subscription.user )
  subscriptions: Subscription[];  //relacion subscription nigga

  @OneToMany(() => FitnessAssessment, (fitnessAssessment) => fitnessAssessment.member)
  assessmentsAsMember: FitnessAssessment[]; //relacion a assessment como member 

  @OneToMany(() => FitnessAssessment, (fitnessAssessment) => fitnessAssessment.worker)
  assessmentsAsWorker: FitnessAssessment[]; //relacion a assessment como worker

  @OneToMany(() => ClassSchedule, (classSchedule) => classSchedule.trainer)
  classesAsTrainer:ClassSchedule[]; // relacion a classSchedule como worker (trainer)

  @OneToMany(() => ClassBooking, (classBooking) => classBooking.member)
  classBookings: ClassBooking[]; //relacion a classBooking como member

  @OneToMany(() => WorkoutPlan, (plan) => plan.member)
  workoutPlansAsMember: WorkoutPlan[]; //relacion a workoutPlan como member

  @OneToMany(() => WorkoutPlan, (plan) => plan.trainer)
  workoutPlansAsTrainer: WorkoutPlan[]; //relacion a workoutPlan como trainer
}
