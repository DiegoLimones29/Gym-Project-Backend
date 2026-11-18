import { Module } from '@nestjs/common';
import { ExerciseCatalogService } from './exercise_catalog.service';
import { ExerciseCatalogController } from './exercise_catalog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseCatalog } from './entities/exercise_catalog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseCatalog])],
  controllers: [ExerciseCatalogController],
  providers: [ExerciseCatalogService],
})
export class ExerciseCatalogModule {}
