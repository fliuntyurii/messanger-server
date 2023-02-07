const express = require('express');
const router = express.Router();

const { 
  register, 
  login, 
  verifyAccount, 
  resendMsgToVerify, 
  logout, 
  forgotPassword, 
  updateForgottenPassword, 
} = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authentication');

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', authenticateUser, logout);

router.put('/verify', verifyAccount);
router.get('/verifyMessage', authenticateUser, resendMsgToVerify);

router.get('/forgotPassword', forgotPassword);
router.put('/reset-password', updateForgottenPassword);

module.exports = router;
