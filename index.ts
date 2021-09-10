import * as express from 'express';
import { RequestHandler, ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import * as cors from 'cors'; // Access-Control-Allow-Origin
import * as morgan from 'morgan';
import * as dotenv from 'dotenv';
import * as passport from 'passport';
import * as hpp from 'hpp';
import * as helmet from 'helmet'; // 웹보안

import passportConfig from './passport';
import { sequelize } from './models';

import userController from './routes/user/user.controller';
import boardController from './routes/boards/board.controller';
import schedulerController from './routes/scheduler/scheduler.controller';
import reviewController from './routes/reviews/review.controller';

dotenv.config();

class Server {
  app: express.Application

  constructor() {
    const app: express.Application = express();
    this.app = app;
    passportConfig();
  }

  private setRoute() {
    this.app.use(userController);
    this.app.use(boardController);
    this.app.use(schedulerController);
    this.app.use(reviewController);
  }

  private setMiddleware() {
    const prod: boolean = process.env.NODE_ENV === 'production';
    this.app.set('port', prod ? process.env.PORT : 3065);
    this.app.use(passport.initialize());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    sequelize.sync({ force: false })
    .then(() => {
      console.log('데이터베이스 연결 성공');
    })
    .catch((err: Error) => {
      console.error(err);
    });
  if (prod) {
    this.app.use(hpp());
    this.app.use(helmet()); 
    this.app.use(morgan('combined'));
  } else {
    this.app.use(morgan('dev'));
      this.app.use(cors({
      origin: true, // 지금은 테스트니깐 origin : true
      credentials: true,
    }))
  }
  }

  public listen(){
    this.setMiddleware();
    this.setRoute();
    
    this.app.get('/', (req, res, next) => {
      res.send('react nodebird 백엔드 정상 동작!');
    });

    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error(err);
      res.status(500).send('서버 에러 발생! 서버 콘솔을 확인하세요.');
    });

    this.app.listen(this.app.get('port'), () => {
      console.log(`server is running on ${this.app.get('port')}`);
    });
  }
}

const appInit = () => {
  const server = new Server();  
  server.listen();
}

appInit();


