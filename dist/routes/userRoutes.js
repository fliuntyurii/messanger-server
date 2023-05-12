"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { authenticateUser, } = require('../middleware/authentication');
const { getAllUsers, getSingleUser, updateUser, updateUserPassword, } = require('../controllers/userController');
router.route('/').get(authenticateUser, getAllUsers);
router.route('/find-user').get(authenticateUser, getSingleUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);
module.exports = router;
