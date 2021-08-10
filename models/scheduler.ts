import {
  DataTypes, Model,
  HasManyAddAssociationMixin
} from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class Scheduler extends Model {
	public readonly id!: number;
	public date!: string;
	public title!: string;
  public genre!: string;

  public UserId!: number;
}

Scheduler.init({
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE(),
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'Scheduler',
  tableName: 'schedulers',
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci',
});

export const associate = (db: dbType) => {
  // Scheduler 는 User 에 연관되어있으니깐 belongsTo
  db.Scheduler.belongsTo(db.User); // scheduler 는 user 에 속해있다.
};

export default Scheduler;
