import { Test, TestingModule } from '@nestjs/testing';
import { InstagramAccountsService } from './instagram-accounts.service';

describe('InstagramAccountsService', () => {
  let service: InstagramAccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstagramAccountsService],
    }).compile();

    service = module.get<InstagramAccountsService>(InstagramAccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
