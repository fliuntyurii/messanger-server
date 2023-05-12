import express from 'express';
const router = express.Router();

const { 
  getDialogue,
  createDialogue,
  deleteDialogue,
  getAllDialogues
} = require('../controllers/dialogueController');
const { authenticateUser } = require('../middleware/authentication');


router.get('/:id', authenticateUser, getDialogue);
router.get('/', authenticateUser, getAllDialogues);
router.post('/', authenticateUser, createDialogue);
router.delete('/:id', authenticateUser, deleteDialogue);

module.exports = router;