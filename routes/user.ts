
import express from 'express';
import { Request } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';

import User from '../models/user';
import Board from '../models/board';
import jwt from "jsonwebtoken";
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
    console.log("login result: " , req.body);
    if (err) {
        console.error(err);
        return next(err);
    }
    if (info) {
        return res.status(401).send(info.message);
    }
    console.log("login user : " , user);
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
        // const token = jwt.sign({ id: user.id }, jwtObj.secret , {algorithm : 'RS256'});
        // fullUser.token = token;
        return res.json(fullUser);
      } catch (e) {
        console.error(e);
        return next(e);
      }
    });
  })(req, res, next);
});

export default router;
