import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RequestWithUserId } from '../auth/jwt-auth.guard';
import { InstagramAccountDto } from './dtos/instagram-account.dto';
import { InstagramAccountsService } from './instagram-accounts.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IgAccountStatsQueryDto } from './dtos/instagram-account-stats-query.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { IgAccountHourStatsDto } from './dtos/instagram-account-stats.dto';

@UseGuards(JwtAuthGuard)
@Controller('instagram-accounts')
@ApiTags('instagram-accounts')
@ApiBearerAuth()
export class InstagramAccountsController {
  constructor(private readonly igAccountsService: InstagramAccountsService) {}
  @Get()
  @ApiOkResponse({
    description: 'Get All linked Instagram Accounts for Facebook Accaunt',
    type: InstagramAccountDto,
    isArray: true,
  })
  async getAll(@Req() req: RequestWithUserId): Promise<InstagramAccountDto[]> {
    await this.igAccountsService.syncWithFacebook(req.user.id);
    return this.igAccountsService.getAll(req.user.id);
  }

  @Get(':id/stats')
  @ApiOkResponse({
    description: 'Get Instagram Account Stats',
  })
  getAccountStats(
    @Param('id') igAccountId: number,
    @Query(new ValidationPipe()) query: IgAccountStatsQueryDto,
    @Req() req: RequestWithUserId,
  ): Promise<IgAccountHourStatsDto[]> {
    const from = new Date(query.from);
    const to = new Date(query.to);
    return this.igAccountsService.getStats(req.user.id, igAccountId, from, to);
  }
}
