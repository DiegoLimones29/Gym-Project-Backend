import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateClassBookingDto {
  @IsUUID()
  @IsNotEmpty()
  classScheduleId: string;

  @IsUUID()
  @IsNotEmpty()
  memberId: string;

  @IsString()
  @IsOptional()
  bookingStatus?: string;
}