const express = require('express');
const router = express.Router();

const {
  getDialogue,
  createDialogue,
  deleteDialogue
} = require('../controllers/dialogueController');
const { authenticateUser } = require('../middleware/authentication');


router.get('/:id', authenticateUser, getDialogue);
router.post('/', authenticateUser, createDialogue);
router.delete('/:id', authenticateUser, deleteDialogue);

module.exports = router;