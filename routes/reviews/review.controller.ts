import * as express from "express"
import { isLoggedIn } from '../middleware';
import { createReview, deleteReview, updateReview } from './review.service';

const router = express.Router();

router.post<any,any,any>('/', isLoggedIn,createReview);
router.patch<any,any,any>('/', isLoggedIn,updateReview);
router.delete<any,any,any>('/', isLoggedIn,deleteReview);
router.get<any,any,any,{ lastId: string, limit: string}>('/', isLoggedIn,deleteReview);

export default router;