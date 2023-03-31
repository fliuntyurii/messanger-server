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
  // refreshCookiesOnClient
} = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authentication');

const {
  showCurrentUser,
} = require('../controllers/userController');

router.route('/showMe').get(authenticateUser, showCurrentUser);

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', authenticateUser, logout);

router.put('/verify', verifyAccount);
router.get('/verifyMessage/:email', authenticateUser, resendMsgToVerify);

router.get('/forgotPassword/:email', forgotPassword);
router.put('/reset-password', updateForgottenPassword);

// router.post('/refresh', authenticateUser, refreshCookiesOnClient)

module.exports = router;
