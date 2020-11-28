import {
  BelongsToMany,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { UnderscoredIndex } from '@common/decorators';
import { UserInstagramAccount } from '../instagram-accounts/models/user-instagram-account.model';
import { InstagramAccount } from '../instagram-accounts/models/instagram-account.model';

@Table({
  tableName: 'users',
})
export class User extends Model<User> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column
  email: string;

  @Column
  name: string;

  @Column
  surname: string;

  @Column
  gender: string;

  @UnderscoredIndex
  @Column({
    allowNull: false,
    field: 'facebook_id',
  })
  facebookId: string;

  @Column({
    allowNull: false,
    field: 'facebook_access_token',
  })
  facebookAccessToken: string;

  @BelongsToMany(() => InstagramAccount, () => UserInstagramAccount)
  instagramAccounts: Array<InstagramAccount & { UserInstagramAccount: UserInstagramAccount }>;

  @CreatedAt createdAt: Date;

  @UpdatedAt updatedAt: Date;

  @DeletedAt deletedAt: Date;
}
