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
    httpOnly: true,
    signed: true,
    expires: new Date(Date.now() + shortExp),
    // sameSite: 'none',
    // secure: true
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    signed: true,
    expires: new Date(Date.now() + longerExp),
    // sameSite: 'none',
    // secure: true
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
