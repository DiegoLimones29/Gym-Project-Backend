import { Module } from '@nestjs/common';
import { FitnessClassService } from './fitness_class.service';
import { FitnessClassController } from './fitness_class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FitnessClass } from './entities/fitness_class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FitnessClass])],
  controllers: [FitnessClassController],
  providers: [FitnessClassService],
})
export class FitnessClassModule {}
