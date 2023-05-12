"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { getDialogue, createDialogue, deleteDialogue, getAllDialogues } = require('../controllers/dialogueController');
const { authenticateUser } = require('../middleware/authentication');
router.get('/:id', authenticateUser, getDialogue);
router.get('/', authenticateUser, getAllDialogues);
router.post('/', authenticateUser, createDialogue);
router.delete('/:id', authenticateUser, deleteDialogue);
module.exports = router;
