import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserCleanupService } from '../realtime/user-cleanup.service';
import { UsersClientService } from '../users-client/users-client.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;
  const usersClient = {
    createUser: jest.fn(),
    findAllUsers: jest.fn(),
    findOneUser: jest.fn(),
    updateUser: jest.fn(),
    removeUser: jest.fn(),
  };
  const userCleanupService = {
    cleanupForDeletedUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UsersClientService, useValue: usersClient },
        { provide: UserCleanupService, useValue: userCleanupService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('proxies remove and triggers user cleanup', async () => {
    usersClient.removeUser.mockResolvedValue({ message: 'Usuario eliminado' });
    const res = await controller.remove('user-1', 'Bearer token');
    expect(usersClient.removeUser).toHaveBeenCalledWith(
      'user-1',
      'Bearer token',
    );
    expect(userCleanupService.cleanupForDeletedUser).toHaveBeenCalledWith(
      'user-1',
    );
    expect(res).toEqual({ message: 'Usuario eliminado' });
  });
});
