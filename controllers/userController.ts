import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.type';

const User = require('../models/User');
const CustomError = require('../errors');
const {
  createTokenUser,
  attachCookiesToResponse,
} = require('../utils');

const getAllUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { username, email } = req.params;
  const user = username ? await User.findOne({ username }).select('-password') :  await User.findOne({ email }).select('-password');
  if (!user) {
    throw new CustomError.NotFoundError(`No user with username : ${req.body.username}`);
  }

  res.status(StatusCodes.OK).json({ 
    id: user._id,
    email: user.email,
    name: user.name,
    username: user.username,
    bio: user.bio,
    image: user.image
  });
};

const showCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('Please provide both values');
  }
  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
