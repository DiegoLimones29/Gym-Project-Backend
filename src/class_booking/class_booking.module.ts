import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassBooking } from './entities/class_booking.entity';
import { ClassSchedule } from '../class_schedule/entities/class_schedule.entity';
import { ClassBookingService } from './class_booking.service';
import { ClassBookingController } from './class_booking.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassBooking, ClassSchedule]),
    AuthModule,
  ],
  controllers: [ClassBookingController],
  providers: [ClassBookingService],
  exports: [ClassBookingService],
})
export class ClassBookingModule {}