import { Request, Response, NextFunction } from "express";
import jwt  from "jsonwebtoken"

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send('로그인이 필요합니다.');
    }
};

const isNotLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send('로그인한 사용자는 접근할 수 없습니다.');
    }
};

// const verifyToken = (req: Request, res: Response, next: NextFunction) => {
//     try {
    
//     if(!req.headers){
//       return res.status(419).json({code: 400,message: "does not exist headers"});
//     }
//     let decode = jwt.verify(req.headers.authentication, "jwt");
//     console.log("middleware decode : " , decode);
//     req.decoded = decode;
//     next();
//     // 인증 실패
//   } catch (error) {
//     // 유효기간이 초과된 경우
//     if (error.name === "TokenExpiredError") {
//       return res.status(419).json({code: 419,message: "expired token"});
//     }
//     // 토큰의 비밀키가 일치하지 않는 경우
//     return res.status(401).json({code: 401,message: "invalid token"});
//   }
// }


export { isLoggedIn, isNotLoggedIn };
