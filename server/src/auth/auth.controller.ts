import {
  Controller,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { FacebookAuthGuard, RequestWithUserJwt } from './facebook-auth.guard';
import { JwtAuthGuard, RequestWithUserId } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  facebookLogin() {
    // FacebookAuthGuard handle request and redirect to facebook auth page
  }

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  facebookLoginCallback(@Request() req: RequestWithUserJwt) {
    console.log('facebookLoginCallback');
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
}
