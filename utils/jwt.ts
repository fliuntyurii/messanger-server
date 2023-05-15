import { TAttachCookies, TCreateJWT } from '../types/token.type';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const createJWT = ({ payload }: TCreateJWT): string => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string);
  return token;
};

const isTokenValid = (token: string): string | JwtPayload => {
  const secret: Secret = process.env.JWT_SECRET || 'default-secret';
  return jwt.verify(token, secret) as string | JwtPayload;;
}

const attachCookiesToResponse = ({ res, user, refreshToken }: TAttachCookies): void => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const shortExp = 1000 * 60 * 60;
  const longerExp = 1000 * 60 * 60 * 24 * 7;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: false,
    expires: new Date(Date.now() + shortExp),
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: false,
    expires: new Date(Date.now() + longerExp),
  });
};

export {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
