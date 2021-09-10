import * as express from "express"
import { AuthRequest } from "../../types/custom_request";
import { isLoggedIn } from '../middleware';
import { createScheduler , deleteScheduler, getScheduler, totalAnalysisData, updateScheduler } from './scheduler.service';

const router = express.Router();

router.post<any,any,any>('/', isLoggedIn,createScheduler);
router.put<any,any,any>('/' , isLoggedIn,updateScheduler);
router.get('/' ,getScheduler);
router.delete<any,any,any>('/',isLoggedIn ,deleteScheduler);
router.get('/total_analysis' ,totalAnalysisData);
router.get<any,any,any>('/total_analysis' , isLoggedIn ,totalAnalysisData);

export default router;