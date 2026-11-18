import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateFitnessAssessmentDto {
  @IsUUID()
  @IsNotEmpty()
  memberId: string;

  @IsUUID()
  @IsNotEmpty()
  workerId: string;

  @IsDateString()
  @IsNotEmpty()
  assessmentDate: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  weightKg: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  bodyFatPercentage: number;

  @IsString()
  @IsOptional()
  notes?: string;
}