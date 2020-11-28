import {
  Controller,
  Get,
  NotFoundException,
  Patch,
  Request,
  UseGuards,
  Body,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtAuthGuard, RequestWithUserId } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(@Request() req: RequestWithUserId): Promise<UserDto> {
    try {
      const user = await this.usersService.getDtoById(req.user.id);
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch {
      throw new NotFoundException();
    }
  }

  @Patch('me')
  async updateCurrentUser(
    @Request() req: RequestWithUserId,
    @Body() userDto: UpdateUserDto,
  ): Promise<UserDto> {
    try {
      // TODO: move this check into `UpdateUserDto` validation
      if (
        userDto.defaultInstagramAccountId &&
        typeof userDto.defaultInstagramAccountId === 'number'
      ) {
        await this.usersService.setDefaultIgAccount(req.user.id, userDto.defaultInstagramAccountId);
        const user = await this.usersService.getDtoById(req.user.id);
        if (!user) {
          throw new Error();
        }
        return user;
      } else {
        throw new Error();
      }
    } catch (err) {
      console.error(err);
      throw new UnprocessableEntityException();
    }
  }
}
