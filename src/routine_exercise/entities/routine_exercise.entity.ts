import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExerciseCatalog } from "../../exercise_catalog/entities/exercise_catalog.entity";
import { WorkoutPlan } from "../../workout_plan/entities/workout_plan.entity";

@Entity('routine_exercises')
export class RoutineExercise {

    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column({ name: 'workout_plan_id', type: 'uuid'})
    workoutPlanId: string; 

    @Column({ name: 'exercise_id', type: 'uuid'})
    exerciseId: string; 

    @Column({ name: 'target_sets', type: 'integer'}) 
    targetSets: number; 

    @Column({ name: 'target_reps', type: 'integer'})
    targetReps: number; 

    @Column({ name: 'order_index', type: 'integer'})
    orderIndex: number; 

    @Column({ type: 'text', nullable: true})
    notes?: string; 

    @ManyToOne(() => ExerciseCatalog, (exerciseCatalog) => exerciseCatalog.routineExercises)
    @JoinColumn({ name: 'exercise_id'})
    exercise: ExerciseCatalog; 

    @ManyToOne(() => WorkoutPlan, (plan) => plan.routineExercises, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'workout_plan_id' })
    workoutPlan: WorkoutPlan;
}
