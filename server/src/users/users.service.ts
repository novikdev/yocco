import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IUser } from './user.interfaces';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  create(userData: Omit<IUser, 'id'>): Promise<User> {
    const user = new User(userData);
    return user.save();
  }

  getById(id: number): Promise<User> {
    return this.userModel.findOne({
      where: { id },
    });
  }

  getByFacebookId(facebookId: string): Promise<User> {
    return this.userModel.findOne({
      where: { facebookId },
    });
  }
}
