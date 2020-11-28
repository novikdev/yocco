import { UnderscoredIndex } from '@common/decorators';
import {
  DataType,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

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
    field: 'facebook_id',
  })
  facebookId: string;

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
    field: 'facebook_access_token',
  })
  facebookAccessToken: string;

  @CreatedAt createdAt: Date;

  @UpdatedAt updatedAt: Date;

  @DeletedAt deletedAt: Date;
}
