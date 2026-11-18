import { Module } from '@nestjs/common';
import { ClassBookingService } from './class_booking.service';
import { ClassBookingController } from './class_booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassBooking } from './entities/class_booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassBooking])],
  controllers: [ClassBookingController],
  providers: [ClassBookingService],
})
export class ClassBookingModule {}
