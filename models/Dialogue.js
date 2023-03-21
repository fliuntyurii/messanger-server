const mongoose = require('mongoose');

const DialogueSchema = new mongoose.Schema({
  users: {
    type: Array,
    default: []
  },
  messages: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model('Dialogue', DialogueSchema);
