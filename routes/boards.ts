import * as express from 'express';
import { Request } from 'express';
import * as Sequelize from 'sequelize';

import User from '../models/user';
import Board from '../models/board';


const router = express.Router();

router.get<any, any, any, { lastId: string, limit: string }>('/', async (req: Request<any, any, any, { lastId: string, limit: string }>, res, next) => {
  // localhost:3065/boards?lastId=10&limit=2
  try {
    let where = {};
    if (parseInt(req.query.lastId, 10)) { // req.query.lastId 을 10 진법으로 변환
      where = {
        id: {
          [Sequelize.Op.lt]: parseInt(req.query.lastId, 10), // less than
        },
      };
    }
    const boards = await Board.findAll({
      where,
      include: [{ // 하위 테이블 조인
        model: User, // 하위 테이블 model
        attributes: ['id', 'nickname'], // 해당 테이블에서 조회 할려는 칼럼 배열
			}],
      order: [['createdAt', 'DESC']], // DESC는 내림차순, ASC는 오름차순
      limit: parseInt(req.query.limit, 10),
    });

    return res.status(200).json(boards);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

export default router;