import { Module } from '@nestjs/common';
import { ClassScheduleService } from './class_schedule.service';
import { ClassScheduleController } from './class_schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSchedule } from './entities/class_schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassSchedule])],
  controllers: [ClassScheduleController],
  providers: [ClassScheduleService],
})
export class ClassScheduleModule {}
