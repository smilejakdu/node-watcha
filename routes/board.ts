import * as express from "express"

import Board from '../models/board';
import User from '../models/user';
import Review from '../models/review';

import { isLoggedIn } from './middleware';
import { AuthRequest, AuthRequestHeader } from "../types/custom_request";

const router = express.Router();

router.post<any, any, any>('/', isLoggedIn, async (req: AuthRequest, res, next) => { // POST /api/board
	const reqDecoded = req.decoded as AuthRequestHeader
  try {
		const newBoard = await Board.create({
			title: req.body.title,
      content: req.body.content, 
      UserId: reqDecoded.id,
		});

    const fullBoard = await Board.findOne({
      where: { id: newBoard.id }, // 조건문 
      include: [{ // 하위 테이블 조인
        model: User,
        attributes: ['id', 'nickname'],
			}],
    });
		return res.status(201).json(fullBoard);

  } catch (e) {
    console.error(e);
    return next(e);
	}
});

router.put<any, any, any>('/', isLoggedIn, async (req: AuthRequest, res, next) => {
  const reqDecoded = req.decoded as AuthRequestHeader
  try {
		await Board.update({
			title : req.body.title,
      content: req.body.content,
    }, {
      where: { id: req.body.id , UserId : reqDecoded.id },
		});
		
		const fullUpdateBoard = await Board.findOne({
			where: { id: req.body.id , UserId : reqDecoded.id}, // 조건문
			include: [{ // 하위 테이블 조인
        model: User,
        attributes: ['id', 'nickname'], // 해당 테이블에서 조회
			}]
		});
    return res.status(200).json(fullUpdateBoard);
  } catch (e) {
    console.error(e);
    next(e);
  }
});


router.get('/:id', async (req, res, next) => {
  try {
    const board = await Board.findOne({
      where : { id: req.params.id },
      include: [{
          model: User,
          attributes: ['id', 'nickname'],
        },{
          model: Review,
          attributes: ['id', 'content' , 'UserId'],
        }],
    });
    return res.status(200).json(board);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.delete<any, any, any>('/:id', isLoggedIn, async (req: AuthRequest, res, next) => { 
  const reqDecoded = req.decoded as AuthRequestHeader

  try {
    const board = await Board.findOne({ where: { id: req.params.id , UserId : reqDecoded.id} });
    if (!board) {
      return res.status(404).send('게시판이 존재하지 않습니다.');
    }
    await Board.destroy({ where: { id: req.params.id } });
    return res.status(200).json(board);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

export default router;