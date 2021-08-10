import * as express from 'express';
import { Request } from 'express';
import * as Sequelize from 'sequelize';

import User from '../models/user';
import Board from '../models/board';
import Review from '../models/review';

import { isLoggedIn } from './middleware';
import { AuthRequest, AuthRequestHeader } from "../types/custom_request";

const router = express.Router();

router.post<any, any, any>('/', isLoggedIn, async (req: AuthRequest, res, next) => { 
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
});

router.patch<any, any, any>('/', isLoggedIn, async (req: AuthRequest, res, next) => {
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
});

router.delete<any, any, any>('/:id', isLoggedIn, async (req: AuthRequest, res, next) => { 
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
});

export default router;