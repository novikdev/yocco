import { arrayToMap, isFilled } from '@common/functions';
import { ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { IBatchRequest, IIgAccount } from '../facebook/facebook.types';
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
import { WhereOptions } from 'sequelize';

const FB_BATCH_LIMIT = 50;

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
  ) {}

  async syncWithFacebook(userId: number): Promise<void> {
    this.logger.debug(`
      ===> syncWithFacebook
        userId: ${userId}
    `);
    try {
      const user = await this.usersService.getById(userId);

      const fbIgAccounts = await this.fbService.getAllUserInstagramAccounts(
        user.facebookId,
        user.facebookAccessToken,
      );

      this.logger.debug(`
          fbIgAccounts: ${fbIgAccounts.map(({ username }) => username).join(',')}
      `);

      const defaultIgAccount = await this.userIgAccauntModel.findOne({
        where: {
          userId,
          isDefault: true,
        },
        paranoid: false,
      });

      this.logger.debug(`
          defaultIgAccountId: ${defaultIgAccount?.igAccountId}
      `);

      await this.sequelize.transaction(async (transaction) => {
        const savedIgAccounts = await InstagramAccount.bulkCreate(fbIgAccounts, {
          transaction,
          updateOnDuplicate: ['username', 'fbIgBusinessAccountId', 'profilePicture'],
        });

        this.logger.debug(`
            fbIgAccounts are saved
        `);

        await this.userIgAccauntModel.destroy({
          where: { userId },
          transaction,
          force: true,
        });

        this.logger.debug(`
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
            new relations are created
        `);
      });
    } catch (err) {
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

  private async doesUserHaveAccessToIgAccount(userId: number, igAccountId: number) {
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
    userId: number,
    igAccountId: number,
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

  private async getAllIgAccountsWithStats(): Promise<
    (InstagramAccount & { user: (User & { UserInstagramAccount: UserInstagramAccount })[] })[]
  > {
    return this.igAccauntModel.findAll({
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
    }) as Promise<
      (InstagramAccount & { user: (User & { UserInstagramAccount: UserInstagramAccount })[] })[]
    >;
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

  @Cron(CronExpression.EVERY_HOUR)
  private async updateIgAccountsStats() {
    try {
      const igAccounts = await this.getAllIgAccountsWithStats();
      const igAccountsChunks = chunk(igAccounts, FB_BATCH_LIMIT / 2);
      for (const igAccountsChunk of igAccountsChunks) {
        const requests = igAccountsChunk
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
          access_token: this.getIgAccountFbAccessToken(igAccountsChunk[0]),
          include_headers: false,
        });

        const hourStats = igAccountsChunk
          .map((igAccount, i) => {
            const followersCountResIndex = i * 2;
            const insightsResIndex = followersCountResIndex + 1;

            this.logger.debug(`
              ===> updateIgAccountsStats
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
              totalFollowersCount = JSON.parse(responses[followersCountResIndex].body)
                ?.followers_count;
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
          })
          .filter(isFilled);
        await this.igAccauntHourStatsModel.bulkCreate(hourStats, {
          validate: true,
          returning: true,
        });
      }
    } catch (err) {
      console.error("Couldn't update ig accounts stats: " + err.message);
    }
  }
}
