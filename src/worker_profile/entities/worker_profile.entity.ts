import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('workers_profiles')
export class WorkerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @Column()
  area: string;

  @Column()
  shift: string;
}
