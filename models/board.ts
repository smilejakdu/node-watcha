import { DataTypes, Model } from 'sequelize';
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
  // Board 는 User 에 연관되어있으니깐 belongsTo
  db.Board.belongsTo(db.User);
};

export default Board;
