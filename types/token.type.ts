import { Response } from 'express';
import { TUserToken } from "./user.type";

export type TAttachCookies = {
  res: Response;
  user: TUserToken;
  refreshToken: string;
}

export type TCreateJWT = {
  payload: {
    user: TUserToken;
    refreshToken?: string;
  }
}

export type TToken = {
  user: string;
  refreshToken: string;
  ip: string;
  userAgent: string;
  isValid: boolean;
} 