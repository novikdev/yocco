import { arrayToMap } from '@common/functions';
import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { IIgAccount } from '../facebook/facebook.interfaces';
import { FacebookService } from '../facebook/facebook.service';
import { UsersService } from '../users/users.service';
import { InstagramAccountDto } from './dtos/instagram-account.dto';
import { InstagramAccount } from './models/instagram-account.model';

@Injectable()
export class InstagramAccountsService {
  constructor(
    private readonly fbService: FacebookService,
    private readonly usersService: UsersService,
    private readonly sequelize: Sequelize,
  ) {}

  async syncWithFacebook(userId: number): Promise<void> {
    try {
      const user = await this.usersService.getById(userId);

      const fbIgAccounts = await this.fbService.getAllUserInstagramAccounts(
        user.facebookId,
        user.facebookAccessToken,
      );
      const savedIgAccounts = await user.$get('instagramAccounts');
      const savedIgAccountsMap = arrayToMap(savedIgAccounts, 'facebookId');

      const newIgAccounts: IIgAccount[] = fbIgAccounts.filter(
        ({ facebookId }) => !savedIgAccountsMap.has(facebookId),
      );

      if (newIgAccounts.length > 0) {
        const isDefault = savedIgAccounts.length === 0 && newIgAccounts.length === 1;
        await this.sequelize.transaction(async (transaction) => {
          const newSavedIgAccounts = await InstagramAccount.bulkCreate(newIgAccounts, {
            transaction,
          });
          await user.$add('instagramAccounts', newSavedIgAccounts, {
            transaction,
            through: isDefault ? { isDefault } : undefined,
          });
        });
      }
    } catch (err) {
      throw new Error("Couldn't sync user instagram accounts with facebook" + err.message);
    }
  }

  async getAll(userId: number): Promise<InstagramAccountDto[]> {
    try {
      const user = await this.usersService.getById(userId);
      const igAccounts = await user.$get('instagramAccounts');
      return igAccounts.map((igAccount) => new InstagramAccountDto(igAccount));
    } catch (err) {
      throw new Error("Couldn't get all user instagram accounts");
    }
  }
}
