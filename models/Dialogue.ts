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

export const Dialogue = mongoose.model<TDialogue>('Dialogue', DialogueSchema);
