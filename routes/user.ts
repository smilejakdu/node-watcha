
import * as express from 'express';
 
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import * as passport from 'passport';

import { isLoggedIn, isNotLoggedIn } from './middleware';
import User from '../models/user';
import Board from '../models/board';
import * as jwt from "jsonwebtoken";
import { jwtObj } from "../config/jwt"
import { AuthRequest, AuthRequestHeader } from "../types/custom_request";

const router = express.Router();

router.post('/signup', async (req, res, next) => {
    console.log("req result: " , req.body);
    try {
        const exUser = await User.findOne({
            where: {
                nickname: req.body.nickname,
            },
        });
        if (exUser) {
            return res.status(403).send('이미 사용 중인 아이디입니다.');
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
      
        const newUser = await User.create({
            nickname: req.body.nickname,
            password: hashedPassword,
        });
        console.log("newUser :" , newUser);
      
        return res.status(200).json(newUser);
    } catch (error) {
        console.error(error);
        next(error);
    }
});


router.post('/login', async (req, res, next) => {
  passport.authenticate('local', (err: Error, user: User, info: { message: string }) => {
    if (err) {
        console.error(err);
        return next(err);
    }
    if (info) {
        return res.status(401).send(info.message);
    }
    return req.login(user, async (loginErr: Error) => {
      try {
        if (loginErr) {
          return next(loginErr)
        }
        const fullUser = await User.findOne({
          where: { id: user.id },
          include: [{
            model: Board,
            as: 'Boards',
            attributes: ['id'],
          }],
          attributes: { exclude: ['password'] },
        });
        // jwt token 생성
        const token = jwt.sign({ id: user.id }, jwtObj.secret , { expiresIn : '2day'});
        // return res.status(200).json(fullUser);
        return res.status(200).json([{'access' : token , 'user' : user.nickname}]);
      } catch (e) {
        console.error(e);
        return next(e);
      }
    });
  })(req, res, next);
});

router.patch<any, any, any>('/nickname', isLoggedIn, async (req: AuthRequest, res, next) => {
  const reqDecoded = req.decoded as AuthRequestHeader

  try {
    await User.update({
      nickname: req.body.nickname,
    }, {
      where: { id: reqDecoded.id },
    });
    res.status(200).send(req.body.nickname);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

interface IUser extends User {
    BoardCount: number;
}

router.get('/:id', async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: parseInt(req.params.id, 10) },
            include: [{
                model: Board,
                as: 'Boards',
                attributes: ['id'],
            }],
            attributes: ['id', 'nickname'],
        });
        if (!user) {
            return res.status(404).send('no user');
        }
        const jsonUser = user.toJSON() as IUser;
        jsonUser.BoardCount = jsonUser.Boards ? jsonUser.Boards.length : 0;
        return res.json(jsonUser);
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

router.get('/:id/boards', async (req, res, next) => {
    try {
        const posts = await Board.findAll({
          where: { // where 에 다가 조건을 걸어둔다.
            // join 걸려있는 UserId 에 따른 Board 를 가져온다. 1 : N 관계
            UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
          },
          include: [{ // include : 하위 테이블 조인
            model: User,
            attributes: ['id', 'nickname'], // 해당 테이블에서 조회 하려는 컬럼 배열
          }],
          order: [['createdAt', 'DESC']], // 순서정렬
        });
        res.json(posts);
      } catch (e) {
        console.error(e);
        next(e);
      }
});

export default router;
