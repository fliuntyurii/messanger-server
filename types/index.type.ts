import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: any;
  userId2?: string;
}

export type TError = {
  statusCode?: number;
  message?: string;
  name?: string;
  errors?: any;
  code?: number;
  keyValue?: any;
  value?: string;
}