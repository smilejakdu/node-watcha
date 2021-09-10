import * as express from "express"
import { isLoggedIn } from '../middleware';
import { createBoard, deleteBoard, getBoardId, totalBoards, updateBoard } from './board.service';

const router = express.Router();

router.post<any,any,any>('/',isLoggedIn,createBoard);
router.put<any,any,any>('/', isLoggedIn,updateBoard);
router.get('/:id',getBoardId);
router.delete<any,any,any>('/:id' , deleteBoard);

router.get<any,any,any,{lastId: string, limit: string}>('/' , totalBoards);

export default router;