import * as express from "express"

import Board from '../../models/board';
import User from '../../models/user';
import Review from '../../models/review';

import { isLoggedIn } from '../middleware';
import { AuthRequest, AuthRequestHeader } from "../../types/custom_request";
import { NextFunction, Request, Response } from "express";
import * as Sequelize from 'sequelize';

export const createBoard = async (req:AuthRequest, res:Response , next:NextFunction) => {
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
}

export const updateBoard = async (req: AuthRequest, res: Response , next: NextFunction)=>{
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
}

export const getBoardId = async (req: Request, res: Response , next: NextFunction)=>{
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
}

export const deleteBoard = async (req: AuthRequest, res: Response , next: NextFunction)=>{
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
}

export const totalBoards = async(req: any, res: Response , next: NextFunction)=>{
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
