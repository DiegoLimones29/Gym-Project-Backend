import { Test, TestingModule } from '@nestjs/testing';
import { MembersProfileService } from './members_profile.service';

describe('MembersProfileService', () => {
  let service: MembersProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembersProfileService],
    }).compile();

    service = module.get<MembersProfileService>(MembersProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
