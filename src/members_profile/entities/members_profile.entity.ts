import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('member_profiles')
export class MembersProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @Column({ unique: true })
  phone: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({ name: 'emergency_contact_phone', nullable: true })
  emergencyContactPhone?: string;
}
