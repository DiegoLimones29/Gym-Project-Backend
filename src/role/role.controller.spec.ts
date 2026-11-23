import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersClientService } from '../users-client/users-client.service';
import { RoleController } from './role.controller';

describe('RoleController', () => {
  let controller: RoleController;
  const usersClient = {
    createRole: jest.fn(),
    findAllRoles: jest.fn(),
    findOneRole: jest.fn(),
    updateRole: jest.fn(),
    removeRole: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [{ provide: UsersClientService, useValue: usersClient }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RoleController>(RoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('proxies findAll to UsersClientService', async () => {
    usersClient.findAllRoles.mockResolvedValue({ data: [{ id: 1, role: 'member' }] });
    const res = await controller.findAll();
    expect(usersClient.findAllRoles).toHaveBeenCalledTimes(1);
    expect(res).toEqual({ data: [{ id: 1, role: 'member' }] });
  });
});
