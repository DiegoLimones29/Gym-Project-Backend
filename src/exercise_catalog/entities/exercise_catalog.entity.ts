import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoutineExercise } from "../../routine_exercise/entities/routine_exercise.entity";

@Entity('exercise_catalog')
export class ExerciseCatalog {

    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column()
    name: string; 

    @Column({ name: 'target_muscle_group'})
    targetMuscleGroup: string; 

    @Column({ name: 'equipment_needed', nullable: true })
    equipmentNeeded: string; 

    @Column({ name: 'video_url', nullable: true })
    videoUrl?: string;
    
    @OneToMany(() => RoutineExercise, (routineExercises) => routineExercises.exercise)
    routineExercises: RoutineExercise[]; 
}
