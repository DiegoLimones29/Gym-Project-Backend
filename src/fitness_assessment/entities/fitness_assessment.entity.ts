import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity('fitness_assessments')
export class FitnessAssessment {

    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column({ name: 'member_id', type: 'uuid'})
    memberId: string; 

    @Column({ name: 'worker_id', type: 'uuid'})
    workerId: string; 

    @Column({ name: 'assessment_date', type: 'date'})
    assessmentDate: string; 

    @Column({ name: 'weight_kg', type: 'numeric', precision: 10, scale: 2})
    weightKg: number; 

    @Column({ name: 'body_fat_percentage', type: 'numeric', precision: 10, scale: 2 })
    bodyFatPercentage: number; 

    @Column({ type: 'text' , nullable: true})
    notes: string; 

    @ManyToOne(() => User, (user) => user.assessmentsAsMember, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'member_id'})
    member: User; 

    @ManyToOne(() => User, (user) => user.assessmentsAsWorker)
    @JoinColumn({ name: 'worker_id'})
    worker: User; 

}
