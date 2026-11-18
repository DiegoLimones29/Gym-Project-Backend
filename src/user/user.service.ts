import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto; //destructuramos para obtener la pinche password

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      ...rest,
      password: hashedPassword,
    });

    try {
      await this.userRepo.save(user);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('El email ya está registrado');
      }
      throw error;
    }

    const { password: _, ...safeUser } = user; //destructuramos para no retornar la password en el response

    return {
      message: 'user saved nigga',
      data: safeUser,
    };
  }

  async findAll() {
    const users = await this.userRepo.find();

    return {
      message: 'users nigga',
      data: users,
    };
  }

  async findOne(id: string) {
    //esta madre jala nomas con uuid
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`user with id ${id} not found nigger`);
    }

    return {
      message: 'user found nigga',
      data: user,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto;

    const user = await this.userRepo.preload({
      id,
      ...rest,
      ...(password && { password: await bcrypt.hash(password, 10) }),
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    try {
      await this.userRepo.save(user);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('El email ya está registrado');
      }
      throw error;
    }

    return {
      message: 'User updated',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
      },
    };
  }

  async remove(id: string) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepo.remove(user);
    return { message: 'User deleted nigga' };
  }

  async findByEmailForAuth(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        roleId: true,
      },
      relations: {
        role: true,
      },
    });
  }
}
