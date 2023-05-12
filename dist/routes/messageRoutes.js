"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { getMessage, createMessage, deleteMessage, updateMessage, getAllMessages } = require('../controllers/messageController');
const { authenticateUser } = require('../middleware/authentication');
router.get('/:id', authenticateUser, getMessage);
router.get('/all/:dialogueId', authenticateUser, getAllMessages);
router.post('/', authenticateUser, createMessage);
router.put('/', authenticateUser, updateMessage);
router.delete('/:id', authenticateUser, deleteMessage);
module.exports = router;
