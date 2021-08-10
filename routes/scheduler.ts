import * as express from 'express';

import User from '../models/user';
import Scheduler from '../models/scheduler';

import { isLoggedIn } from './middleware';
import { AuthRequest, AuthRequestHeader } from "../types/custom_request";

const router = express.Router();

router.post<any, any, any>('/', isLoggedIn, async (req: AuthRequest, res, next) => { 
	const reqDecoded = req.decoded as AuthRequestHeader

  try {
		const newScheduler = await Scheduler.create({
			date: req.body.date,
			genre: req.body.genre, 
			title: req.body.title,
      UserId: reqDecoded.id,
		});

    const fullScheduler = await Scheduler.findOne({
      where: { id: newScheduler.id }, // 조건문 
      include: [{ // 하위 테이블 조인
        model: User,
        attributes: ['id', 'nickname'],
			}],
    });
		return res.status(201).json(fullScheduler);

  } catch (e) {
    console.error(e);
    return next(e);
	}
});

router.put<any, any, any>('/', isLoggedIn, async (req: AuthRequest, res, next) => {
  const reqDecoded = req.decoded as AuthRequestHeader
  try {
		await Scheduler.update({
			date : req.body.date,
			genre: req.body.genre,
			title: req.body.title,
    }, {
      where: { id: req.body.id , UserId : reqDecoded.id },
		});
		
		const fullUpdateScheduler = await Scheduler.findOne({
			where: { id: req.body.id , UserId : reqDecoded.id}, // 조건문
			include: [{ // 하위 테이블 조인
        model: User,
        attributes: ['id', 'nickname'], // 해당 테이블에서 조회
			}]
		});
    res.status(200).json(fullUpdateScheduler);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/', async (req, res, next) => {
    try {
			const schedulers = await Scheduler.findAll({
          include: [{ // include : 하위 테이블 조인
            model: User,
            attributes: ['id', 'nickname'], // 해당 테이블에서 조회 하려는 컬럼 배열
          }],
          order: [['createdAt', 'DESC']], // 순서정렬
        });
        return res.status(200).json(schedulers);
      } catch (e) {
        console.error(e);
        next(e);
      }
});

router.delete<any, any, any>('/:id', isLoggedIn, async (req: AuthRequest, res, next) => { 
  const reqDecoded = req.decoded as AuthRequestHeader

  try {
    const scheduler = await Scheduler.findOne({ where: { id: req.params.id , UserId : reqDecoded.id} });
    if (!scheduler) {
      return res.status(404).send('스케쥴이 존재하지 않습니다.');
    }
    await Scheduler.destroy({ where: { id: req.params.id } });
    return res.status(200).json(scheduler);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.get('/analysis', async (req, res, next) => {
  try {
    const schedulers = await Scheduler.findAll({
        attributes: ['genre'], // 해당 테이블에서 조회 하려는 컬럼 배열
    });

    interface MovieData {
      [key: string]: number;
    }

    const movieData: MovieData = {
      action : 0,
      fear : 0,
      comic : 0,
      romance : 0,
      drama : 0,
      comic_romance : 0,
    }

    schedulers.forEach(scheduler => {
      movieData[`${scheduler}`] += 1
    });

    return res.status(200).json(movieData);
    } catch (e) {
      console.error(e);
      next(e);
    }
});

router.get<any, any, any>('/polar', isLoggedIn, async (req: AuthRequest, res, next) => { 
  const reqDecoded = req.decoded as AuthRequestHeader

  try {
    const schedulers = await Scheduler.findAll({
      where: {
          UserId: reqDecoded.id,
        },
        include: [{ // include : 하위 테이블 조인
          model: User,
          attributes: ['id', 'nickname'], // 해당 테이블에서 조회 하려는 컬럼 배열
        }],
    });
    
    interface MovieData {
      [key: string]: number;
    }

    const movieData: MovieData = {
      action : 0,
      fear : 0,
      comic : 0,
      romance : 0,
      drama : 0,
      comic_romance : 0,
    }

    schedulers.forEach(scheduler => {
      movieData[`${scheduler}`] += 1
    });

      return res.status(200).json(movieData);
    } catch (e) {
      console.error(e);
      next(e);
    }
});

export default router;