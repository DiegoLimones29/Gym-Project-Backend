import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClassSchedule } from "../../class_schedule/entities/class_schedule.entity";

@Entity('fitness_classes')
export class FitnessClass {

    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column()
    name: string; 

    @Column({ type: 'text'})
    description: string; 

    @Column({ type: "integer"})
    capacity: number; 

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive: boolean; 

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz'})
    createdAt: Date;  

    @OneToMany(() => ClassSchedule, (classSchedule) => classSchedule.fitnessClass)
    classSchedules: ClassSchedule[]; 
}
