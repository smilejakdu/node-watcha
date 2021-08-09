
import * as express from 'express';
 
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import * as passport from 'passport';

import { isLoggedIn, isNotLoggedIn } from './middleware';
import User from '../models/user';
import Board from '../models/board';
import * as jwt from "jsonwebtoken";
import { jwtObj } from "../config/jwt"

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

router.patch<any, any, any>('/nickname', isLoggedIn, async (req: any, res, next) => {
  try {
    await User.update({
      nickname: req.body.nickname,
    }, {
      where: { id: req.decoded.id },
    });
    res.status(200).send(req.body.nickname);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

export default router;
