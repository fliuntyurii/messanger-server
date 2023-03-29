const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const mailSandler = require('../utils/mailSandler')
const User = require('../models/User');
const Token = require('../models/Token');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');

const register = async (req, res) => {
  const { email, name, password, username, bio, image } = req.body;

  if (!email || !name || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';
  const verificationToken = crypto.randomBytes(40).toString('hex');
  const isVerified = false;

  const user = await User.create({ 
    email,
    name,
    username: username || '',
    bio: bio || '',
    image: image || '',
    password,
    role,
    verificationToken,
    isVerified
  });
  const tokenUser = createTokenUser(user);

  const message = 
    `<i>Hello, ${name}. To complete your sign up, please verify your email: 
    <a href="http://${process.env.CLIENT_URL}/verify?token=${user.verificationToken}&id=${user._id}">CLICK</a>.
    PUSLE MESSANGER!</i>`;
  await mailSandler(email, 'Verify Your Email', message);

  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ token: req.signedCookies });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  const tokenUser = createTokenUser(user);
  let refreshToken = '';
  const existingToken = await Token.findOne({ user: user._id });

  if(existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ refreshToken });
    res.status(StatusCodes.OK).json({ token: req.signedCookies });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };
  
  await Token.create(userToken);
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ token: req.signedCookies });
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });

  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ logout: true });
};

const verifyAccount = async (req, res) => {
  const { id, token } = req.body;
  const user = await User.findByIdAndUpdate({ _id: id }, { isVerified: true });

  if (!user || token !== user.verificationToken) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  if (user.isVerified) {
    throw new CustomError.UnauthenticatedError('User is already verified!');
  }
  await user.save();

  res.status(StatusCodes.OK).json({ message: 'Email verified success!' });
};

const resendMsgToVerify = async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email });

  if (!email) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  if (user.isVerified) {
    throw new CustomError.UnauthenticatedError('The user is already verified!');
  }

  const message = 
    `<i>Hello, ${user.name}. To complete your sign up, please verify your email: 
    <a href="http://${process.env.CLIENT_URL}/verify?token=${user.verificationToken}&id=${user._id}">CLICK</a>.
    PUSLE MESSANGER!</i>`;
  await mailSandler(email, 'Verify Your Email', message);

  res.status(StatusCodes.OK).json({ message: 'Check your email!' });
}

const forgotPassword = async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email });

  if (!email) {
    throw new CustomError.BadRequestError('Please provide email');
  }
  if (!user) {
    throw new CustomError.NotFoundError(`No user with email : ${email}`);
  }

  const passwordToken = crypto.randomBytes(70).toString('hex');
  const passwordTokenExpirationDate = new Date(Date.now() + 1000 * 60 * 10);

  user.passwordToken = passwordToken;
  user.passwordTokenExpirationDate = passwordTokenExpirationDate;
  await user.save();

  const message = 
    `<i>Follow the link to reset password: 
    <a href="http://${process.env.CLIENT_URL}/reset-password?token=${user.passwordToken}&email=${email}">LINK</a>.
    PUSLE MESSANGER!</i>`;
  await mailSandler(email, 'Reset Password', message);

  res.status(StatusCodes.OK).json({ message: 'Check your email!' });
}

const updateForgottenPassword = async (req, res) => {
  const { token, email } = req.query;
  const { password, confirmPassword } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const user = await User.findOneAndUpdate({ email }, { password: hashPassword });

  if (!password || !confirmPassword) {
    throw new CustomError.BadRequestError('Please provide password');
  }
  if (!user || password !== confirmPassword) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  if (user.passwordToken !== token) {
    throw new CustomError.UnauthenticatedError('Token has expired');
  }

  user.password = hashPassword;
  user.passwordToken = null;
  user.passwordTokenExpirationDate = null;

  await user.save();
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
}

module.exports = {
  register,
  login,
  verifyAccount,
  resendMsgToVerify,
  logout,
  forgotPassword,
  updateForgottenPassword,
};
