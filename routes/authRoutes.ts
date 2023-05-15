import express from 'express';
const router = express.Router();

import { 
  register, 
  login, 
  verifyAccount, 
  resendMsgToVerify, 
  logout, 
  forgotPassword, 
  updateForgottenPassword, 
  isUserExist
} from '../controllers/authController';
import { authenticateUser } from '../middleware/authentication';

import {
  showCurrentUser,
} from '../controllers/userController';

router.route('/showMe').get(authenticateUser, showCurrentUser);

router.post('/register', register);
router.post('/login', login);
router.get('/isUserExist', isUserExist);

router.delete('/logout', authenticateUser, logout);

router.put('/verify', authenticateUser, verifyAccount);
router.get('/verifyMessage/:email', authenticateUser, resendMsgToVerify);

router.get('/forgotPassword/:email', forgotPassword);
router.put('/reset-password', updateForgottenPassword);

export default router;