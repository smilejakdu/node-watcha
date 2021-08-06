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

import userRouter from './routes/user';

dotenv.config();
const app = express();
passportConfig();
const prod: boolean = process.env.NODE_ENV === 'production';

app.set('port', prod ? process.env.PORT : 3065);
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err: Error) => {
    console.error(err);
  });
if (prod) {
  app.use(hpp());
  app.use(helmet()); 
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
    app.use(cors({
    origin: true, // 지금은 테스트니깐 origin : true
    credentials: true,
  }))
}

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRouter);

app.get('/', (req, res, next) => {
  res.send('react nodebird 백엔드 정상 동작!');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send('서버 에러 발생! 서버 콘솔을 확인하세요.');
});

app.listen(app.get('port'), () => {
  console.log(`server is running on ${app.get('port')}`);
});