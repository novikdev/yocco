import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export type RequestWithUserId = Request & { user: { id: number; tokenId: number } };

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
