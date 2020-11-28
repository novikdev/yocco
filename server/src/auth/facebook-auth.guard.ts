import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export type RequestWithUserJwt = Request & { user: { jwt: string } };

@Injectable()
export class FacebookAuthGuard extends AuthGuard('facebook') {}
