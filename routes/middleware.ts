import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { jwtObj } from "../config/jwt"
import { AuthRequest , AuthRequestHeader } from "../types/custom_request";


const isLoggedIn = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if(!req.headers){
      return res.status(419).json({code: 400,message: "does not exist headers"});
    }

    const authRequestHeaders = req.headers as AuthRequestHeader;

    req.decoded = jwt.verify(authRequestHeaders.authentication, jwtObj.secret);
    next();
    // 인증 실패
  } catch (error) {
    // 유효기간이 초과된 경우
    if (error.name === "TokenExpiredError") {
      return res.status(419).send("expired token");
    }
    // 토큰의 비밀키가 일치하지 않는 경우
    return res.status(401).send("invalid token");
  }
};

const isNotLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('로그인한 사용자는 접근할 수 없습니다.');
  }
};


export { isLoggedIn, isNotLoggedIn };
