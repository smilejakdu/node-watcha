import * as express from "express"
import { isLoggedIn } from '../middleware';
import { signUp , logIn ,updateUser, getUser, getUserBoards } from './user.service';


const router = express.Router();

router.post('/signup' ,signUp);
router.post('/login' ,logIn);
router.patch<any,any,any>('/nickname' , isLoggedIn,  updateUser);
router.get('/:id' ,getUser);
router.get('/:id/boards' , getUserBoards);

export default router;