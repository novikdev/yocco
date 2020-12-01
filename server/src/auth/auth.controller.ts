import {
  Controller,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { FacebookAuthGuard, RequestWithUserJwt } from './facebook-auth.guard';
import { JwtAuthGuard, RequestWithUserId } from './jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  facebookLogin() {
    // FacebookAuthGuard handle request and redirect to facebook auth page
  }

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  facebookLoginCallback(@Request() req: RequestWithUserJwt) {
    const { jwt } = req.user;
    if (jwt) {
      return { success: true, jwt };
    } else {
      throw new UnauthorizedException();
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Request() req: RequestWithUserId) {
    try {
      const { id, email } = await this.usersService.getById(req.user.id);
      return { id, email };
    } catch {
      throw new NotFoundException();
    }
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: RequestWithUserId) {
    return this.authService.logout(req.user.tokenId);
  }
}
