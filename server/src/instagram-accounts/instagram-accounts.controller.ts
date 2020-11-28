import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RequestWithUserId } from '../auth/jwt-auth.guard';
import { InstagramAccountDto } from './dtos/instagram-account.dto';
import { InstagramAccountsService } from './instagram-accounts.service';

@UseGuards(JwtAuthGuard)
@Controller('instagram-accounts')
export class InstagramAccountsController {
  constructor(private readonly igAccountsService: InstagramAccountsService) {}
  @Get()
  async getAll(@Req() req: RequestWithUserId): Promise<InstagramAccountDto[]> {
    await this.igAccountsService.syncWithFacebook(req.user.id);
    return this.igAccountsService.getAll(req.user.id);
  }
}
