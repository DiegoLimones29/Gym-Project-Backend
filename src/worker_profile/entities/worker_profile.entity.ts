import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity('workers_profiles')
export class WorkerProfile {

    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column({name: 'user_id'})
    userId: string; 

    @Column()
    area: string; 

    @Column()
    shift: string; 

    @OneToOne(() => User, (user) => user.workerProfile, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'user_id'})
    user: User; 
}
