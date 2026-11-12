import { PartialType } from '@nestjs/mapped-types';
import { CreateExerciseCatalogDto } from './create-exercise_catalog.dto';

export class UpdateExerciseCatalogDto extends PartialType(CreateExerciseCatalogDto) {}
