import express from 'express';
const router = express.Router();

import { 
  getDialogue,
  createDialogue,
  deleteDialogue,
  getAllDialogues
} from '../controllers/dialogueController';
import { authenticateUser } from '../middleware/authentication';

router.get('/:id', authenticateUser, getDialogue);
router.get('/', authenticateUser, getAllDialogues);
router.post('/', authenticateUser, createDialogue);
router.delete('/:id', authenticateUser, deleteDialogue);

export default router;