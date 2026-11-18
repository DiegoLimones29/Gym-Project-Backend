import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FitnessClass } from './entities/fitness_class.entity';
import { FitnessClassService } from './fitness_class.service';
import { FitnessClassController } from './fitness_class.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([FitnessClass]), AuthModule],
  controllers: [FitnessClassController],
  providers: [FitnessClassService],
  exports: [FitnessClassService],
})
export class FitnessClassModule {}