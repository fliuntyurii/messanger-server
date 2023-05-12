import mongoose from 'mongoose';
import { TToken } from '../types/token.type';

const Schema = mongoose.Schema;

const tokenSchema = new Schema<TToken>({
  user: {
    type: String,
    ref: 'User',
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  isValid: {
    type: Boolean,
    default: true
  }
},
{ timestamps: true });

module.exports = mongoose.model<TToken>('Token', tokenSchema);