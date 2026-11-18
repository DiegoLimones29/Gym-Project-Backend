import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseCatalog } from './entities/exercise_catalog.entity';
import { ExerciseCatalogService } from './exercise_catalog.service';
import { ExerciseCatalogController } from './exercise_catalog.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseCatalog]), AuthModule],
  controllers: [ExerciseCatalogController],
  providers: [ExerciseCatalogService],
  exports: [ExerciseCatalogService],
})
export class ExerciseCatalogModule {}