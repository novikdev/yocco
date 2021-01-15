import { arrayToMap, isFilled } from '@common/functions';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { IIgAccount } from '../facebook/facebook.types';
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

const FB_BATCH_LIMIT = 50;

@Injectable()
export class InstagramAccountsService {
  constructor(
    @InjectModel(InstagramAccount)
    private igAccauntModel: typeof InstagramAccount,
    @InjectModel(UserInstagramAccount)
    private userIgAccauntModel: typeof UserInstagramAccount,
    @InjectModel(IgAccountHourStats)
    private igAccauntHourStatsModel: typeof IgAccountHourStats,
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
      const savedIgAccountsMap = arrayToMap(savedIgAccounts, 'fbIgAccountId');

      const newIgAccounts: IIgAccount[] = fbIgAccounts.filter(
        ({ fbIgAccountId }) => !savedIgAccountsMap.has(fbIgAccountId),
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

  private async getAllIgAccountsWithStats(): Promise<InstagramAccount[]> {
    return this.igAccauntModel.findAll({
      include: [
        {
          model: IgAccountHourStats,
          order: [['datetime', 'DESC']],
          limit: 1,
        },
      ],
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  private async updateIgAccountsStats() {
    try {
      const igAccounts = await this.getAllIgAccountsWithStats();
      const igAccountsChunks = chunk(igAccounts, FB_BATCH_LIMIT / 2);
      for (const igAccountsChunk of igAccountsChunks) {
        const requests = igAccountsChunk
          .map((igAccount) => {
            const insightsSearchParams = new URLSearchParams();
            insightsSearchParams.set('metric', 'follower_count');
            insightsSearchParams.set('period', 'day');

            return [
              {
                method: 'get',
                relative_url: `${igAccount.fbIgBusinessAccountId}?fields=followers_count`,
                access_token: igAccount.fbAccessToken,
              },
              {
                method: 'get',
                relative_url: `${
                  igAccount.fbIgBusinessAccountId
                }/insights?${insightsSearchParams.toString()}`,
                access_token: igAccount.fbAccessToken,
              },
            ];
          })
          .flat();

        const responses = await this.fbService.sendBtach({
          batch: requests,
          access_token: igAccountsChunk[0].fbAccessToken,
          include_headers: false,
        });

        const hourStats = igAccountsChunk
          .map((igAccount, i) => {
            const followersCountResIndex = i * 2;
            const insightsResIndex = followersCountResIndex + 1;
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