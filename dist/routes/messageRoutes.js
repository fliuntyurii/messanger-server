"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const messageController_1 = require("../controllers/messageController");
const authentication_1 = require("../middleware/authentication");
router.get('/:id', authentication_1.authenticateUser, messageController_1.getMessage);
router.get('/all/:dialogueId', authentication_1.authenticateUser, messageController_1.getAllMessages);
router.post('/', authentication_1.authenticateUser, messageController_1.createMessage);
router.put('/', authentication_1.authenticateUser, messageController_1.updateMessage);
router.delete('/:id', authentication_1.authenticateUser, messageController_1.deleteMessage);
exports.default = router;
