import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { TUser } from '../types/user.type';

const UserSchema = new mongoose.Schema<TUser>({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 24,
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'Please provide username'],
    minlength: 4,
    maxlength: 12,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide email'],
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Please provide valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  verified: Date,
  passwordToken: String,
  passwordTokenExpirationDate: Date,
  dialogues: {
    type: [],
    default: []
  },
  language: {
    type: String,
    default: 'en'
  },
  image: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  }
});

UserSchema.pre<TUser>('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (canditatePassword: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

export const User = mongoose.model<TUser>('User', UserSchema);
