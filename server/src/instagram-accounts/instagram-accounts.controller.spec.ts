import { Test, TestingModule } from '@nestjs/testing';
import { InstagramAccountsController } from './instagram-accounts.controller';

describe('InstagramAccountsController', () => {
  let controller: InstagramAccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstagramAccountsController],
    }).compile();

    controller = module.get<InstagramAccountsController>(InstagramAccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
