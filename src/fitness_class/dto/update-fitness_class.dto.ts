import { PartialType } from '@nestjs/mapped-types';
import { CreateFitnessClassDto } from './create-fitness_class.dto';

export class UpdateFitnessClassDto extends PartialType(CreateFitnessClassDto) {}
