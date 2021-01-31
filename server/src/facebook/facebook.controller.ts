import { AppConfigService } from '@common/modules/config';
import { Body } from '@nestjs/common';
import { BadRequestException, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { FbWebhookSubscribeQueryDto } from './dtos/fb-webhook-subscribe-query.dto';
import { FacebookService } from './facebook.service';
import { IFbPermissionChange, IFbWebhook } from './facebook.types';

@Controller('facebook')
export class FacebookController {
  private readonly logger = new Logger(FacebookController.name);

  constructor(
    private readonly configService: AppConfigService,
    private readonly fbService: FacebookService,
  ) {}

  @Get('webhooks/permissions')
  public confirmWebhookSubscribtion(@Query() query: FbWebhookSubscribeQueryDto) {
    const isTokenVerified = query['hub.verify_token'] === this.configService.fbWebhookVerifyToken;
    this.logger.debug(`
      ===> confirmWebhookSubscribtion
        mode: ${query['hub.mode']}
        challenge: ${query['hub.challenge']}
        is token verified: ${isTokenVerified}
    `);
    if (query['hub.mode'] === 'subscribe' && isTokenVerified) {
      return query['hub.challenge'];
    }
    throw new BadRequestException();
  }

  @Post('webhooks/permissions')
  public async changePermissions(@Body() body: IFbWebhook<IFbPermissionChange>) {
    this.fbService.handlePermissionsChange(body);
  }
}
