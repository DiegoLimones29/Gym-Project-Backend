import { Injectable } from '@nestjs/common';
import { CreateFitnessClassDto } from './dto/create-fitness_class.dto';
import { UpdateFitnessClassDto } from './dto/update-fitness_class.dto';

@Injectable()
export class FitnessClassService {
  create(createFitnessClassDto: CreateFitnessClassDto) {
    return 'This action adds a new fitnessClass';
  }

  findAll() {
    return `This action returns all fitnessClass`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fitnessClass`;
  }

  update(id: number, updateFitnessClassDto: UpdateFitnessClassDto) {
    return `This action updates a #${id} fitnessClass`;
  }

  remove(id: number) {
    return `This action removes a #${id} fitnessClass`;
  }
}
