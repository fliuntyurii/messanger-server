import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from '../types/index.type';
import CustomError from '../errors';
import { Token } from '../models/Token';
import { isTokenValid } from '../utils';
import { attachCookiesToResponse } from '../utils';

const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const { refreshToken, accessToken } = req.cookies;

  try {
    if(accessToken) {
      const payload = isTokenValid(accessToken);
      if (typeof payload !== 'string') {
        req.user = payload.user;
        return next();
      }
    }
    
    const payload = isTokenValid(refreshToken);
    if (typeof payload === 'string') {
      throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }
    else {
      const existingToken = await Token.findOne({
        user: payload.user.userId,
        refreshToken: payload.refreshToken
      });
  
      if(!existingToken || !existingToken?.isValid) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid');
      }
  
      attachCookiesToResponse({ res, user: payload.user, refreshToken: existingToken.refreshToken });
      req.user = payload.user;
      next();
    }
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
};

const authorizePermissions = (...roles: any) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};

export {
  authenticateUser,
  authorizePermissions,
};
