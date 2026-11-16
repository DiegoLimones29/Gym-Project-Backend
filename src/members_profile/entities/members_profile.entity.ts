import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity('member_profiles')
export class MembersProfile {

    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column({ name: 'user_id'})
    userId: number; 

    @Column({ unique: true })
    phone: string; 

    @Column({ name: 'birth_date'})
    birthDate: Date; 

    @Column({ name: 'emergency_contact_phone'})
    emergencyContactPhone?: string; 

    @OneToOne(() => User, (user) => user.memberProfile, {onDelete: 'CASCADE'}) //necesito entender esta puta sintaxis 
    @JoinColumn({name: 'user_id'})
    user: User; 
}
