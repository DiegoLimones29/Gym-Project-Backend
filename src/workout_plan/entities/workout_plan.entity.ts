import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoutineExercise } from "../../routine_exercise/entities/routine_exercise.entity";
import { User } from "../../user/entities/user.entity";

@Entity('workout_plans')
export class WorkoutPlan {

    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column({ name: 'member_id', type: 'uuid'})
    memberId: string; 

    @Column({ name: 'trainer_id', type: 'uuid'})
    trainerId: string;

    @Column()
    title: string; 

    @Column()
    goal: string; 

    @Column({ name: 'is_active', type: 'boolean', default: true})
    isActive: boolean; 

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz'})
    createdAt: Date; 

    @OneToMany(() => RoutineExercise, (routineExercise) => routineExercise.workoutPlan)
    routineExercises: RoutineExercise[]; 
    
    @ManyToOne(() => User, (user) => user.workoutPlansAsMember, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'member_id'})
    member: User; 

    @ManyToOne(() => User, (user) => user.workoutPlansAsTrainer)
    @JoinColumn({ name: 'trainer_id'})
    trainer: User; 
}
