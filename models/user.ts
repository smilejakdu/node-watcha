import { 
  Model, DataTypes, BelongsToManyGetAssociationsMixin, 
  HasManyGetAssociationsMixin, BelongsToManyRemoveAssociationMixin,
  BelongsToManyAddAssociationMixin,
} from 'sequelize';

import { dbType } from './index';
import Board from './board';
import { sequelize } from './sequelize';

class User extends Model {
  public readonly id!: number;
  public nickname!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly Boards?: Board[];

  public getBoards!: HasManyGetAssociationsMixin<Board>;
}

User.init({
  nickname: {
		type: DataTypes.STRING(20),
    unique: true,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

// 1 대 다 관계 : hasMany < - > belongsTo
// 1 대 1 관계 : hasOne < - > belongsTo
// N:M 관계 : belongsToMany

export const associate = (db: dbType) => {
  // User는 게시판을 여러개 가지고 있어서 hasMany
  db.User.hasMany(db.Board, { as: 'Boards' });
};

export default User;
