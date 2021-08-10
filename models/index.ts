import User, { associate as associateUser } from './user';
import Board, { associate as associateBoard } from './board';
import Review, { associate as associateReview } from './review';
import Scheduler, { associate as associateScheduler } from './scheduler';

// 여기서 설정을 해줘야 다들 모델들에서 export const associate 에 관계를 설정할수있다.
export * from './sequelize';
const db = {
  User,
  Board,
  Review,
  Scheduler
};
export type dbType = typeof db;

associateUser(db);
associateBoard(db);
associateReview(db);
associateScheduler(db);
