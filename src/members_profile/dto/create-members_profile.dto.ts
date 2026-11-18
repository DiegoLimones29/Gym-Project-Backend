import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMembersProfileDto {

    @IsNotEmpty()
    userId: string; 

    @IsString()
    @IsNotEmpty()
    phone: string; 

    @IsDate()
    birthDate: string; 

    @IsOptional()
    @IsString()
    emergencyContactPhone: string; 
}
