import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateWorkerProfileDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  area: string;

  @IsString()
  @IsNotEmpty()
  shift: string;
}