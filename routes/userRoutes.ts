import express, { Router } from 'express';
const router = express.Router();

import { authenticateUser } from '../middleware/authentication';
import {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
} from '../controllers/userController';

router.route('/').get(authenticateUser, getAllUsers);
router.route('/find-user').get(authenticateUser, getSingleUser);

router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);

export default router;