import { TUserToken } from "../types/user.type";
import CustomError from '../errors';

export const checkPermissions = (requestUser: TUserToken, resourceUserId: string) => {
  if (requestUser.role === 'admin' || requestUser.role === 'user' ) return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new CustomError.UnauthorizedError(
    'Not authorized to access this route'
  );
};