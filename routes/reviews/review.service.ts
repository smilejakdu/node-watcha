import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import * as Sequelize from 'sequelize';

import User from '../../models/user';
import Board from '../../models/board';
import Review from '../../models/review';

import { isLoggedIn } from '../middleware';
import { AuthRequest, AuthRequestHeader } from "../../types/custom_request";

const router = express.Router();

export const createReview = async (req:AuthRequest, res:Response , next: NextFunction) => {
	const reqDecoded = req.decoded as AuthRequestHeader

	try {
		const newReview = await Review.create({
			content: req.body.content,
			UserId: reqDecoded.id,
			BoardId : req.body.boardId,
		});

    const fullReview = await Review.findOne({
      where: { id: newReview.id }, // 조건문 
			include: [{ 
        model: User,
        attributes: ['id', 'nickname'],
				}, {
				model: Board,
        attributes: ['id', 'title','content'],
				}],
				order: [['createdAt', 'DESC']],
		});

		return res.status(201).json(fullReview);
  } catch (e) {
    console.error(e);
    return next(e);
	}
}

export const updateReview = async(req: AuthRequest, res: Response, next: NextFunction) => {
	const reqDecoded = req.decoded as AuthRequestHeader

  try {
		await Review.update({
      content: req.body.content,
    }, {
      where: { id: req.body.id , UserId : reqDecoded.id },
		});
		
		const fullUpdateReview = await Board.findOne({
			where: { id: req.body.id , UserId : reqDecoded.id}, // 조건문
			include: [{ // 하위 테이블 조인
        model: User,
        attributes: ['id', 'nickname'], // 해당 테이블에서 조회
			}]
		});
    return res.status(200).json(fullUpdateReview);
  } catch (e) {
    console.error(e);
    next(e);
  }
}

export const deleteReview = async (req: AuthRequest, res: Response , next: NextFunction) => {
  const reqDecoded = req.decoded as AuthRequestHeader

  try {
    const review = await Review.findOne({ where: { id: req.params.id , UserId : reqDecoded.id} });
    if (!review) {
      return res.status(404).send('review 가 존재하지 않습니다.');
		}
    await Review.destroy({ where: { id: req.params.id } });
    return res.status(200).json(review);
  } catch (e) {
    console.error(e);
    return next(e);
  }
}


export const getReview = async (req: any, res: Response , next: NextFunction) =>{
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
}

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