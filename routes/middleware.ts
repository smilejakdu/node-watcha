import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { jwtObj } from "../config/jwt"

const isLoggedIn = (req: any, res: Response, next: NextFunction) => {
  // req : Request 이렇게 다시 고쳐야 한다.
  try {
    if(!req.headers){
      return res.status(419).json({code: 400,message: "does not exist headers"});
    }
    let decode = jwt.verify(String(req.headers.authentication), jwtObj.secret);

    console.log("middleware decode2 : ", decode);
    const decoded = decode;
    req.decoded = decoded;
    next();
    // 인증 실패
  } catch (error) {
    // 유효기간이 초과된 경우
    if (error.name === "TokenExpiredError") {
      return res.status(419).json({code: 419,message: "expired token"});
    }
    // 토큰의 비밀키가 일치하지 않는 경우
    return res.status(401).json({code: 401,message: "invalid token"});
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
