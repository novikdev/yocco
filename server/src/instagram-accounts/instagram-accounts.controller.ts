import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RequestWithUserId } from '../auth/jwt-auth.guard';
import { InstagramAccountDto } from './dtos/instagram-account.dto';
import { InstagramAccountsService } from './instagram-accounts.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('instagram-accounts')
@ApiTags('instagram-accounts')
@ApiBearerAuth()
export class InstagramAccountsController {
  constructor(private readonly igAccountsService: InstagramAccountsService) {}
  @Get()
  @ApiOkResponse({
    description: 'Get All linked Instagram Accaunts for Facebook Accaunt',
    type: InstagramAccountDto,
    isArray: true,
  })
  async getAll(@Req() req: RequestWithUserId): Promise<InstagramAccountDto[]> {
    await this.igAccountsService.syncWithFacebook(req.user.id);
    return this.igAccountsService.getAll(req.user.id);
  }
}
