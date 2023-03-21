const express = require('express');
const router = express.Router();

const {
  getMessage,
  createMessage,
  deleteMessage,
  updateMessage,
  getAllMessages
} = require('../controllers/messageController');
const { authenticateUser } = require('../middleware/authentication');


router.get('/:id', authenticateUser, getMessage);
router.get('/all/:dialogueId', authenticateUser, getAllMessages);
router.post('/', authenticateUser, createMessage);
router.put('/', authenticateUser, updateMessage);
router.delete('/:id', authenticateUser, deleteMessage);

module.exports = router;