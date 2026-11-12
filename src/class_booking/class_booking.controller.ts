import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClassBookingService } from './class_booking.service';
import { CreateClassBookingDto } from './dto/create-class_booking.dto';
import { UpdateClassBookingDto } from './dto/update-class_booking.dto';

@Controller('class-booking')
export class ClassBookingController {
  constructor(private readonly classBookingService: ClassBookingService) {}

  @Post()
  create(@Body() createClassBookingDto: CreateClassBookingDto) {
    return this.classBookingService.create(createClassBookingDto);
  }

  @Get()
  findAll() {
    return this.classBookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classBookingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassBookingDto: UpdateClassBookingDto) {
    return this.classBookingService.update(+id, updateClassBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classBookingService.remove(+id);
  }
}
