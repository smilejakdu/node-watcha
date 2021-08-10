import * as express from 'express';
import { Request } from 'express';
import * as Sequelize from 'sequelize';

import User from '../models/user';
import Board from '../models/board';

import { isLoggedIn } from './middleware';
import { AuthRequest, AuthRequestHeader } from "../types/custom_request";

const router = express.Router();



export default router;