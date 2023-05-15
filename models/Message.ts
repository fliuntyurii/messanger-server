import mongoose from 'mongoose';
import { TMessage } from '../types/dialogue.type';

const MessageSchema = new mongoose.Schema<TMessage>({
  from: {
    type: String,
    ref: 'User',
    required: true
  },
  to: {
    type: String,
    ref: 'User',
    required: true
  },
  dialogueId: {
    type: String,
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

export const Message = mongoose.model<TMessage>('Message', MessageSchema);
