
import express from 'express';
import { Request } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';

import { isLoggedIn, isNotLoggedIn } from './middleware';
import User from '../models/user';
import Board from '../models/board';

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
    const user = req.user!.toJSON() as User;
    return res.json({ ...user, password: null });
});

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

export default router;
