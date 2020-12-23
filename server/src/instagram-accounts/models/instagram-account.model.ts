import { UnderscoredIndex } from '@common/decorators';
import {
  DataType,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '../../users/user.model';
import { IgAccountHourStats } from './ig-account-hour-stats.model';
import { UserInstagramAccount } from './user-instagram-account.model';

@Table({
  tableName: 'instagram_accounts',
})
export class InstagramAccount extends Model<InstagramAccount> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @UnderscoredIndex
  @Column({
    allowNull: false,
    field: 'fb_ig_account_id',
  })
  fbIgAccountId: string;

  @Column({
    allowNull: false,
    field: 'fb_ig_business_account_id',
  })
  fbIgBusinessAccountId: string;

  @Column({
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING(512),
    allowNull: false,
    field: 'profile_picture',
  })
  profilePicture: string;

  @Column({
    allowNull: false,
    field: 'fb_access_token',
  })
  fbAccessToken: string;

  @BelongsToMany(() => User, () => UserInstagramAccount)
  user: User[];

  @HasMany(() => IgAccountHourStats)
  stats: Array<IgAccountHourStats>;

  @CreatedAt createdAt: Date;

  @UpdatedAt updatedAt: Date;

  @DeletedAt deletedAt: Date;
}
