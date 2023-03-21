const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dialogueId: {
    type: mongoose.Types.ObjectId,
    ref: 'Dialogue',
    required: true
  },
  text: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
  },
  createdAt: {
    type: Date,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Message', MessageSchema);
