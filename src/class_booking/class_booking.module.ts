import { Module } from '@nestjs/common';
import { ClassBookingService } from './class_booking.service';
import { ClassBookingController } from './class_booking.controller';

@Module({
  controllers: [ClassBookingController],
  providers: [ClassBookingService],
})
export class ClassBookingModule {}
