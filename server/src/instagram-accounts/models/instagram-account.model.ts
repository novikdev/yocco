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
    primaryKey: true,
    unique: true,
  })
  id: string;

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

  @BelongsToMany(() => User, () => UserInstagramAccount, 'ig_account_id', 'user_id')
  user: User[];

  @HasMany(() => IgAccountHourStats)
  stats: Array<IgAccountHourStats>;

  @CreatedAt createdAt: Date;

  @UpdatedAt updatedAt: Date;

  @DeletedAt deletedAt: Date;
}
