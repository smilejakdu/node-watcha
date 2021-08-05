import {
  DataTypes, Model, BelongsToManyAddAssociationsMixin, HasManyAddAssociationsMixin,
  HasManyAddAssociationMixin, BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin,
} from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';
import User from './user';

class Board extends Model {
	public readonly id!: number;
	public title!: string;
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public UserId!: number;

}

Board.init({
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Board',
  tableName: 'boards',
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci',
});

export const associate = (db: dbType) => {
  db.Board.belongsTo(db.User);
  db.Board.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
};

export default Board;
