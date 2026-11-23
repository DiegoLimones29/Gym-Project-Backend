import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('fitness_assessments')
export class FitnessAssessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'member_id', type: 'uuid' })
  memberId: string;

  @Column({ name: 'worker_id', type: 'uuid' })
  workerId: string;

  @Column({ name: 'assessment_date', type: 'date' })
  assessmentDate: string;

  @Column({ name: 'weight_kg', type: 'numeric', precision: 10, scale: 2 })
  weightKg: number;

  @Column({
    name: 'body_fat_percentage',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  bodyFatPercentage: number;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
