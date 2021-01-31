import {
  Controller,
  Get,
  NotFoundException,
  Patch,
  Request,
  UseGuards,
  Body,
  UnprocessableEntityException,
  Logger,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RequestWithUserId } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOkResponse({
    description: 'Get user info',
    type: UserDto,
  })
  async getCurrentUser(@Request() req: RequestWithUserId): Promise<UserDto> {
    try {
      this.logger.debug(`
        ===> getCurrentUser
          userId: ${req.user.id}
      `);
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
  @ApiOkResponse({
    description: 'Update user info',
    type: UserDto,
  })
  async updateCurrentUser(
    @Request() req: RequestWithUserId,
    @Body() userDto: UpdateUserDto,
  ): Promise<UserDto> {
    try {
      // TODO: move this check into `UpdateUserDto` validation
      if (
        userDto.defaultInstagramAccountId &&
        typeof userDto.defaultInstagramAccountId === 'string'
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
