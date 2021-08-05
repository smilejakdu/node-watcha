import User, { associate as associateUser } from './user';
import Board, { associate as associateBoard } from './board';

export * from './sequelize';
const db = {
  User,
  Board,
};
export type dbType = typeof db;

associateUser(db);
associateBoard(db);
