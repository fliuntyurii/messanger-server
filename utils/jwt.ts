import { TAttachCookies, TCreateJWT } from '../types/token.type';

const jwt = require('jsonwebtoken');

const createJWT = ({ payload }: TCreateJWT): string => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const isTokenValid = (token: string): void => jwt.verify(token, process.env.JWT_SECRET);

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

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
