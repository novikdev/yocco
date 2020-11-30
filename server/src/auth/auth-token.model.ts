import {
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table({
  tableName: 'auth_tokens',
})
export class AuthToken extends Model<AuthToken> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column({
    allowNull: false,
    field: 'device_id',
  })
  deviceId: string;

  @ForeignKey(() => User)
  @Column({
    field: 'user_id',
  })
  userId: number;

  @Column({
    allowNull: false,
    field: 'expires_at',
  })
  expiresAt: Date;

  @CreatedAt createdAt: Date;

  @UpdatedAt updatedAt: Date;

  @DeletedAt deletedAt: Date;
}
