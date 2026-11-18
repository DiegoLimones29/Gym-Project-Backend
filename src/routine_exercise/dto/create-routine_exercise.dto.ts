import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateRoutineExerciseDto {
  @IsUUID()
  @IsNotEmpty()
  workoutPlanId: string;

  @IsUUID()
  @IsNotEmpty()
  exerciseId: string;

  @IsInt()
  @IsPositive()
  targetSets: number;

  @IsInt()
  @IsPositive()
  targetReps: number;

  @IsInt()
  @Min(1)
  orderIndex: number;

  @IsString()
  @IsOptional()
  notes?: string;
}