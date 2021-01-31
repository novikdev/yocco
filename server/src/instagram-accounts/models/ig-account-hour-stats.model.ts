import {
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Index,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { InstagramAccount } from './instagram-account.model';

@Table({
  tableName: 'ig_account_hour_stats',
})
export class IgAccountHourStats extends Model<IgAccountHourStats> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @ForeignKey(() => InstagramAccount)
  @Column({
    field: 'ig_account_id',
  })
  igAccountId: string;

  @Index
  @Column
  datetime: Date;

  @Column({
    field: 'follows_count',
  })
  followsCount: number;

  @Column({
    field: 'unfollows_count',
  })
  unfollowsCount: number;

  @Column({
    field: 'delta_followers_count',
  })
  deltaFollowersCount: number;

  @Column({
    field: 'total_followers_count',
  })
  totalFollowersCount: number;

  @Column({
    field: 'raw_follows_count',
  })
  rawFollowsCount: number;

  @Column({
    field: 'raw_follows_datetime',
  })
  rawFollowsDatetime: Date;

  @CreatedAt createdAt: Date;

  @UpdatedAt updatedAt: Date;

  @DeletedAt deletedAt: Date;
}
