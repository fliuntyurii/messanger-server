import mongoose from 'mongoose';
import { TDialogue } from "./dialogue.type";

export type TUserToken = {
  name: string;
  userId?: string;
  role: string;
  verificationToken?: string;
  isVerified: boolean;
  bio: string;
  image: string;
  dialogues: string[] | [];
  language: string;
  username: string;
  email: string;
}

export interface TUser extends mongoose.Document {
  _id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  verificationToken?: string;
  isVerified: boolean;
  verified?: Date;
  passwordToken?: string;
  passwordTokenExpirationDate?: Date;
  dialogues: string[] | [];
  language: string;
  image: string;
  bio: string;

  comparePassword: (password: string) => Promise<boolean>;
}