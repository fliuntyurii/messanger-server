import mongoose from 'mongoose';
import { TDialogue } from '../types/dialogue.type';

const DialogueSchema = new mongoose.Schema<TDialogue>({
  users: {
    type: [],
    default: []
  },
  messages: {
    type: [],
    default: []
  }
});

module.exports = mongoose.model<TDialogue>('Dialogue', DialogueSchema);
