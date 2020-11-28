import { Column, Model, Table } from 'sequelize-typescript';

@Table
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
  gender: string;

  @Column({
    allowNull: false,
  })
  facebookId: string;

  @Column({
    allowNull: false,
  })
  facebookAccessToken: string;
}
