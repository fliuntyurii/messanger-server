const jwt = require('jsonwebtoken');

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const shortExp = 1000 * 60 * 60;
  const longerExp = 1000 * 60 * 60 * 24 * 7;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: false,
    signed: true,
    expires: new Date(Date.now() + shortExp),
    sameSite: 'Lax',
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: false,
    signed: true,
    expires: new Date(Date.now() + longerExp),
    sameSite: 'Lax',
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
