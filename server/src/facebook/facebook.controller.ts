import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RequestWithUserId } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { FacebookService } from './facebook.service';
import { InstagramAccount } from './facebook.types';

@UseGuards(JwtAuthGuard)
@Controller('facebook')
export class FacebookController {
  constructor(
    private readonly usersService: UsersService,
    private readonly fbService: FacebookService,
  ) {}

  @Get('instagram_accounts')
  public async getInstagramAccounts(@Req() req: RequestWithUserId): Promise<InstagramAccount[]> {
    // TODO: fetch data somwhere else
    const { facebookId, facebookAccessToken } = await this.usersService.getById(req.user.id);
    const facebookAccounts = await this.fbService.getUserPages(facebookId, facebookAccessToken);
    return facebookAccounts;
  }
}
