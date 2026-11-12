import { Test, TestingModule } from '@nestjs/testing';
import { MembersProfileController } from './members_profile.controller';
import { MembersProfileService } from './members_profile.service';

describe('MembersProfileController', () => {
  let controller: MembersProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersProfileController],
      providers: [MembersProfileService],
    }).compile();

    controller = module.get<MembersProfileController>(MembersProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
