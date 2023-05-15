"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authentication_1 = require("../middleware/authentication");
const userController_1 = require("../controllers/userController");
router.route('/').get(authentication_1.authenticateUser, userController_1.getAllUsers);
router.route('/find-user').get(authentication_1.authenticateUser, userController_1.getSingleUser);
router.route('/updateUser').patch(authentication_1.authenticateUser, userController_1.updateUser);
router.route('/updateUserPassword').patch(authentication_1.authenticateUser, userController_1.updateUserPassword);
exports.default = router;
