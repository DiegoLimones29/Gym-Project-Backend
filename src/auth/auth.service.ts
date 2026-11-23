import { Injectable } from '@nestjs/common';
import { UsersClientService } from '../users-client/users-client.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersClient: UsersClientService) {}

  login(loginDto: LoginDto) {
    return this.usersClient.login(loginDto);
  }
}
