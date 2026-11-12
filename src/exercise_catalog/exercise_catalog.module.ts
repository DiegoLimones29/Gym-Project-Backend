import { Module } from '@nestjs/common';
import { ExerciseCatalogService } from './exercise_catalog.service';
import { ExerciseCatalogController } from './exercise_catalog.controller';

@Module({
  controllers: [ExerciseCatalogController],
  providers: [ExerciseCatalogService],
})
export class ExerciseCatalogModule {}
