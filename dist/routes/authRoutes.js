"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { register, login, verifyAccount, resendMsgToVerify, logout, forgotPassword, updateForgottenPassword, isUserExist } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authentication');
const { showCurrentUser, } = require('../controllers/userController');
router.route('/showMe').get(authenticateUser, showCurrentUser);
router.post('/register', register);
router.post('/login', login);
router.get('/isUserExist', isUserExist);
router.delete('/logout', authenticateUser, logout);
router.put('/verify', authenticateUser, verifyAccount);
router.get('/verifyMessage/:email', authenticateUser, resendMsgToVerify);
router.get('/forgotPassword/:email', forgotPassword);
router.put('/reset-password', updateForgottenPassword);
module.exports = router;
