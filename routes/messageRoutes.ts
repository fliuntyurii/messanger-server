import express from 'express';
const router = express.Router();

import {
  getMessage,
  createMessage,
  deleteMessage,
  updateMessage,
  getAllMessages
} from '../controllers/messageController';
import { authenticateUser } from '../middleware/authentication';

router.get('/:id', authenticateUser, getMessage);
router.get('/all/:dialogueId', authenticateUser, getAllMessages);
router.post('/', authenticateUser, createMessage);
router.put('/', authenticateUser, updateMessage);
router.delete('/:id', authenticateUser, deleteMessage);

export default router;