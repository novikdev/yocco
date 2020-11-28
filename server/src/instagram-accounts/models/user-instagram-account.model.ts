import {
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from '../../users/user.model';
import { InstagramAccount } from './instagram-account.model';

@Table({
  tableName: 'user_instagram_accounts',
})
export class UserInstagramAccount extends Model<UserInstagramAccount> {
  @ForeignKey(() => User)
  @Column({
    field: 'user_id',
    unique: 'main_instagram_account',
  })
  userId: number;

  @ForeignKey(() => InstagramAccount)
  @Column({
    field: 'instagram_account_id',
  })
  instagramAccountId: number;

  @Column({
    field: 'is_default',
    unique: 'main_instagram_account',
    defaultValue: null,
    comment: 'It is default instagram account of the user. Can be true or null',
  })
  isDefault: boolean;

  @CreatedAt createdAt: Date;

  @UpdatedAt updatedAt: Date;

  @DeletedAt deletedAt: Date;
}
