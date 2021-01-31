import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InstagramAccount } from '../instagram-accounts/models/instagram-account.model';
import { UserDto } from './dtos/user.dto';
import { IUser } from './user.interfaces';
import { User } from './user.model';
import { Sequelize } from 'sequelize-typescript';
import { FindAttributeOptions, Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private readonly sequelize: Sequelize,
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

  getAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async getDtoById(id: number): Promise<UserDto | null> {
    const user = await this.userModel.findOne({
      where: { id },
      include: [
        {
          model: InstagramAccount,
          through: {
            where: {
              isDefault: true,
            },
          },
        },
      ],
    });
    return user && new UserDto(user);
  }

  public getByFacebookId(facebookId: string): Promise<User> {
    return this.userModel.findOne({
      where: { facebookId },
    });
  }

  public getByFacebookIds(
    facebookIds: string[],
    attributes?: FindAttributeOptions,
  ): Promise<User[]> {
    return this.userModel.findAll({
      where: {
        facebookId: {
          [Op.or]: facebookIds,
        },
      },
      attributes,
    });
  }

  public async setDefaultIgAccount(
    userId: number,
    newDefaultIgAccountId: InstagramAccount['id'],
  ): Promise<void> {
    const user = await this.userModel.findByPk(userId, {
      include: [
        {
          model: InstagramAccount,
          through: {
            where: {
              isDefault: true,
            },
          },
        },
      ],
    });

    if (!user) {
      throw new Error("Couldn't find user with id=" + userId);
    }

    const currentDefaultIgAccount = user.instagramAccounts[0];

    await this.sequelize.transaction(async (transaction) => {
      if (currentDefaultIgAccount) {
        await user.$add('instagramAccounts', currentDefaultIgAccount, {
          transaction,
          through: { isDefault: null },
        });
      }

      await user.$add('instagramAccounts', newDefaultIgAccountId, {
        transaction,
        through: { isDefault: true },
      });
    });
  }

  async isUserActive(userId: number): Promise<boolean> {
    return Boolean(await this.userModel.findByPk(userId));
  }
}
