import { isFilled } from '@common/functions';
import { ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { IBatchRequest } from '../facebook/facebook.types';
import { FacebookService } from '../facebook/facebook.service';
import { UsersService } from '../users/users.service';
import { InstagramAccountDto } from './dtos/instagram-account.dto';
import { InstagramAccount } from './models/instagram-account.model';
import { Cron, CronExpression } from '@nestjs/schedule';
import { chunk } from 'lodash';
import { IgAccountHourStats } from './models/ig-account-hour-stats.model';
import { UserInstagramAccount } from './models/user-instagram-account.model';
import { Op } from 'sequelize';
import { IgAccountHourStatsDto } from './dtos/instagram-account-stats.dto';
import { format } from 'date-fns';
import { DATE_ISO_FORMAT } from '@common/services/dates.service';
import { Logger } from '@nestjs/common';
import { User } from '../users/user.model';
import { AppConfigService } from '@common/modules/config';

const FB_BATCH_LIMIT = 50;

type InstagramAccountWithStats = InstagramAccount & {
  user: (User & { UserInstagramAccount: UserInstagramAccount })[];
};

@Injectable()
export class InstagramAccountsService {
  private readonly logger = new Logger(InstagramAccountsService.name);

  constructor(
    @InjectModel(InstagramAccount)
    private igAccauntModel: typeof InstagramAccount,
    @InjectModel(UserInstagramAccount)
    private userIgAccauntModel: typeof UserInstagramAccount,
    @InjectModel(IgAccountHourStats)
    private igAccauntHourStatsModel: typeof IgAccountHourStats,
    @Inject(forwardRef(() => FacebookService))
    private readonly fbService: FacebookService,
    private readonly usersService: UsersService,
    private readonly sequelize: Sequelize,
    private readonly configService: AppConfigService,
  ) {}

  /**
   * Fetch all instagram accounts from Facebook and save them into DB for user with id === userId
   * Returns array with new accounts
   */
  public async syncWithFacebook(userId: number): Promise<InstagramAccount['id'][]> {
    this.logger.debug(`
      ===> syncWithFacebook (1)
        userId: ${userId}
    `);
    try {
      let newIgAccountsIds: InstagramAccount['id'][] = [];
      const user = await this.usersService.getById(userId);

      const fbIgAccounts = await this.fbService.getAllUserInstagramAccounts(
        user.facebookId,
        user.facebookAccessToken,
      );

      this.logger.debug(`
        ===> syncWithFacebook (2)
          fbIgAccounts: ${fbIgAccounts.map(({ username }) => username).join(',')}
      `);

      const igAccounts = await this.userIgAccauntModel.findAll({
        where: {
          userId,
        },
        paranoid: false,
      });

      const defaultIgAccount = igAccounts.find(({ isDefault }) => isDefault);

      this.logger.debug(`
        ===> syncWithFacebook (3)
          defaultIgAccountId: ${defaultIgAccount?.igAccountId}
      `);

      await this.sequelize.transaction(async (transaction) => {
        const savedIgAccounts = await InstagramAccount.bulkCreate(fbIgAccounts, {
          transaction,
          updateOnDuplicate: ['username', 'fbIgBusinessAccountId', 'profilePicture'],
        });

        newIgAccountsIds = savedIgAccounts
          .filter((savedIgAccount) => {
            const igAccount = igAccounts.find(
              ({ igAccountId }) => igAccountId === savedIgAccount.id,
            );
            return !igAccount || igAccount.deletedAt !== null;
          })
          .map(({ id }) => id);

        this.logger.debug(`
          ===> syncWithFacebook (4)
            fbIgAccounts are saved
            new ig accounts ids: [${newIgAccountsIds}]
        `);

        await this.userIgAccauntModel.destroy({
          where: { userId },
          transaction,
          force: true,
        });

        this.logger.debug(`
          ===> syncWithFacebook (5)
            old relations are removed
        `);

        const userIgAccounts = savedIgAccounts.map(({ id }, index) => ({
          userId,
          igAccountId: id,
          fbAccessToken: fbIgAccounts[index].fbAccessToken,
          isDefault: id === defaultIgAccount?.igAccountId || fbIgAccounts.length === 1 || undefined,
        }));
        await this.userIgAccauntModel.bulkCreate(userIgAccounts, {
          transaction,
        });

        this.logger.debug(`
          ===> syncWithFacebook (6)
            new relations are created
        `);
      });

      return newIgAccountsIds;
    } catch (err) {
      this.logger.error(
        `
        ===> syncWithFacebook (catch)
          Couldn't sync user instagram accounts with facebook:
          ${err.message}
      `,
        err.stack,
      );
      throw new Error("Couldn't sync user instagram accounts with facebook: " + err.message);
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

  private async doesUserHaveAccessToIgAccount(
    userId: User['id'],
    igAccountId: InstagramAccount['id'],
  ) {
    const association = await this.userIgAccauntModel.findOne({
      where: {
        userId,
        igAccountId,
      },
      attributes: [],
    });

    return Boolean(association);
  }

  async getStats(
    userId: User['id'],
    igAccountId: InstagramAccount['id'],
    from: Date,
    to: Date,
  ): Promise<IgAccountHourStatsDto[]> {
    const isAllowed = await this.doesUserHaveAccessToIgAccount(userId, igAccountId);
    if (!isAllowed) {
      throw new ForbiddenException(`You do not have access to ig account with id ${igAccountId}`);
    }
    // HACK: cast `from` and `to` any, cause sequelize types issue
    const stats = await this.igAccauntHourStatsModel.findAll({
      where: {
        igAccountId,
        datetime: { [Op.between]: [from as any, to as any] },
      },
      order: [['datetime', 'DESC']],
      attributes: [
        'datetime',
        'followsCount',
        'unfollowsCount',
        'deltaFollowersCount',
        'totalFollowersCount',
      ],
    });
    return stats;
  }

  private async getIgAccountsWithStats(
    igAccountIds?: InstagramAccount['id'][],
  ): Promise<InstagramAccountWithStats[]> {
    const where = igAccountIds ? { id: igAccountIds } : undefined;
    return this.igAccauntModel.findAll({
      where,
      include: [
        {
          model: IgAccountHourStats,
          order: [['datetime', 'DESC']],
          limit: 1,
        },
        {
          model: User,
          required: true,
          through: {
            attributes: ['fbAccessToken'],
          },
        },
      ],
    }) as Promise<InstagramAccountWithStats[]>;
  }

  public async destroyUsersAccounts(userIds: User['id'][]) {
    this.userIgAccauntModel.destroy({
      where: {
        userId: {
          [Op.or]: userIds,
        },
      },
    });
  }

  private getIgAccountFbAccessToken(
    igAccount: InstagramAccount & {
      user: (User & { UserInstagramAccount: UserInstagramAccount })[];
    },
  ): string {
    return igAccount.user[0].UserInstagramAccount.fbAccessToken;
  }

  public async getIgAccountStats(
    userId: User['id'],
    igAccountId: InstagramAccount['id'],
  ): Promise<IgAccountHourStatsDto> {
    this.logger.debug(`
      ===> getIgAccountStats (1)
        igAccountId: ${igAccountId}
    `);
    const isAllowed = await this.doesUserHaveAccessToIgAccount(userId, igAccountId);
    if (!isAllowed) {
      throw new ForbiddenException(`You do not have access to ig account with id ${igAccountId}`);
    }
    const igAccounts = await this.getIgAccountsWithStats([igAccountId]);
    this.logger.debug(`
        ===> getIgAccountStats (2)
          select ig accounts: ${igAccounts.map(({ username }) => username).join(',')}
      `);
    const [hourStats] = await this.getIgAccountsStats(igAccounts);
    if (!hourStats) {
      throw new Error('Error on fetching and preparing current account ig account stats');
    }

    return new IgAccountHourStatsDto(hourStats);
  }

  private async getIgAccountsStats(igAccounts: InstagramAccountWithStats[]) {
    this.logger.debug(`
      ===> getIgAccountsStats (1)
        igAccountIds: [${igAccounts.map(({ username }) => username).join(',')}]
    `);
    const maxIgAccountsLength = FB_BATCH_LIMIT / 2;
    if (igAccounts.length > maxIgAccountsLength) {
      throw new Error(`Max igAccounts array length is ${maxIgAccountsLength}`);
    }
    const appAccessToken = this.configService.fbAppId + '|' + this.configService.fbAppSecret;
    const requests = igAccounts
      .map((igAccount): IBatchRequest[] => [
        {
          method: 'get',
          relative_url: `${igAccount.fbIgBusinessAccountId}`,
          search: {
            fields: 'followers_count',
          },
          access_token: this.getIgAccountFbAccessToken(igAccount),
        },
        {
          method: 'get',
          relative_url: `${igAccount.fbIgBusinessAccountId}/insights`,
          search: {
            metric: 'follower_count',
            period: 'day',
          },
          access_token: this.getIgAccountFbAccessToken(igAccount),
        },
      ])
      .flat();

    const responses = await this.fbService.sendBtach({
      batch: requests,
      access_token: appAccessToken,
      include_headers: false,
    });

    this.logger.debug(`
      ===> getIgAccountsStats (3)
        get fb responses
    `);

    return igAccounts.map((igAccount, i) => {
      const followersCountResIndex = i * 2;
      const insightsResIndex = followersCountResIndex + 1;

      this.logger.debug(`
          ===> getIgAccountsStats (4)
            igAccount: ${igAccount.id}
            followersCountResponse: ${JSON.stringify(responses[followersCountResIndex])}
            insightsResponse: ${JSON.stringify(responses[insightsResIndex])}
        `);
      // TODO: handle `code !== 200`
      if (
        responses[followersCountResIndex]?.code !== 200 ||
        responses[insightsResIndex]?.code !== 200
      ) {
        return null;
      }

      let totalFollowersCount;
      let insights;
      try {
        totalFollowersCount = JSON.parse(responses[followersCountResIndex].body)?.followers_count;
        insights = JSON.parse(responses[insightsResIndex].body)?.data[0].values[1];
      } catch (err) {
        console.error(err);
        return null;
      }

      const lastSavedStats: IgAccountHourStats | undefined = igAccount.stats[0];

      let followsCount = 0;
      let deltaFollowersCount = 0;

      if (lastSavedStats) {
        followsCount = insights.value;
        deltaFollowersCount = totalFollowersCount - lastSavedStats.totalFollowersCount;

        const lastSavedStatsFbDay = format(
          new Date(lastSavedStats.rawFollowsDatetime),
          DATE_ISO_FORMAT,
        );
        const resStatsFbDay = format(new Date(insights.end_time), DATE_ISO_FORMAT);

        if (lastSavedStatsFbDay === resStatsFbDay) {
          followsCount = followsCount - lastSavedStats.rawFollowsCount;
        }
      }

      return {
        igAccountId: igAccount.id,
        datetime: new Date(),
        followsCount,
        unfollowsCount: followsCount - deltaFollowersCount,
        deltaFollowersCount,
        totalFollowersCount,
        rawFollowsCount: insights.value,
        rawFollowsDatetime: insights.end_time,
      };
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  public async updateIgAccountsStats(igAccountsIds?: InstagramAccount['id'][]) {
    this.logger.debug(`
      ===> updateIgAccountsStats (1)
        igAccountIds: [${igAccountsIds}]
    `);
    try {
      const igAccounts = await this.getIgAccountsWithStats(igAccountsIds);
      this.logger.debug(`
        ===> updateIgAccountsStats (2)
          select ig accounts: ${igAccounts.map(({ username }) => username).join(',')}
      `);
      const igAccountsChunks = chunk(igAccounts, FB_BATCH_LIMIT / 2);
      for (const igAccountsChunk of igAccountsChunks) {
        const hourStats = (await this.getIgAccountsStats(igAccountsChunk)).filter(isFilled);
        await this.igAccauntHourStatsModel.bulkCreate(hourStats, {
          validate: true,
          returning: true,
        });
      }
      this.logger.debug(`
        ===> updateIgAccountsStats (3)
          Ig accounts stats is updated successfully
      `);
    } catch (err) {
      this.logger.error(
        `
        ===> updateIgAccountsStats
          Couldn't update ig accounts stats:
            ${err.message}
      `,
        err.stack,
      );
    }
  }
}
