import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExerciseCatalogDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  targetMuscleGroup: string;

  @IsString()
  @IsOptional()
  equipmentNeeded?: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;
}