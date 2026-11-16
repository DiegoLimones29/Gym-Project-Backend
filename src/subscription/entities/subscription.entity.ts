import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MembershipPlan } from '../../membership_plan/entities/membership_plan.entity';
import { User } from '../../user/entities/user.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'member_id', type: 'uuid' })
  memberId: string;

  @Column({ name: 'plan_id', type: 'int' })
  planId: number;

  @Column({ name: 'start_date', type: 'timestamptz' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamptz' })
  endDate: Date;

  @Column()
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;


  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn({ name: 'member_id'})
  user: User; 

  @ManyToOne(() => MembershipPlan, (membershipPlan) => membershipPlan.subscriptions)
  @JoinColumn({name: 'plan_id'})
  membershipPlan: MembershipPlan; 
}
