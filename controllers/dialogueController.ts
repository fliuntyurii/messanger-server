import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.type';

const Dialogue = require('../models/Dialogue');
const Message = require('../models/Message');
const CustomError = require('../errors');
const User = require('../models/User');

const getDialogue = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = req.body.id;
  const dialogue = 
    await Dialogue.findById(req.params.id) ||
    await Dialogue.findOne({ users: [req.user.userId, user] }) ||
    await Dialogue.findOne({ users: [user, req.user.userId] });

  if (!req.params.id) {
    throw new CustomError.BadRequestError('Please, provide dialogue id.');
  }

  if (!dialogue) {
    if (!user) {
      throw new CustomError.BadRequestError('Please, provide user id to create dialogue.');
    }
    createDialogue(req, res, user);
    return;
  }

  if (!dialogue.users.includes(req.user.userId)) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  res.status(StatusCodes.OK).json({ dialogue });
}

const getAllDialogues = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const ids = req.user.dialogues;

  if(!ids || !ids.length) {
    throw new CustomError.BadRequestError('Please, provide dialogues ids.');
  }

  const dialogues = await Dialogue.find({ _id: { $in: ids } });
  if (!dialogues) {
    throw new CustomError.NotFoundError(`No dialogues with id : ${ids}`);
  }

  res.status(StatusCodes.OK).json({ dialogues });
}

const createDialogue = async (req: AuthenticatedRequest, res: Response, userId2: string): Promise<void> => {
  const userId1 = req.user.userId;

  if (!userId2) {
    throw new CustomError.BadRequestError('Please, provide user id.');
  }

  if (userId1 === userId2) {
    throw new CustomError.BadRequestError('Something went wrong.');
  }

  const user1 = await User.findById(userId1);
  const user2 = await User.findById(userId2);

  const dialogue = await Dialogue.create({ 
    users: [
      userId1, userId2
    ],
    messages: []
  });

  user1.dialogues.push(String(dialogue._id));
  await user1.save();
  user2.dialogues.push(String(dialogue._id));
  await user2.save();

  res.status(StatusCodes.OK).json({ dialogue });
}

const deleteDialogue = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const dialogue = await Dialogue.findById(req.params.id);

  const user1 = await User.findById(dialogue.users[0]);
  const user2 = await User.findById(dialogue.users[1]);

  if (!dialogue) {
    throw new CustomError.NotFoundError(`No dialogue with id : ${req.params.id}`);
  }

  if (!dialogue.users.includes(req.user.userId)) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  user1.dialogues = user1.dialogues.filter((d: string) => d != String(dialogue._id));
  await user1.save();
  user2.dialogues = user2.dialogues.filter((d: string) => d != String(dialogue._id));
  await user2.save();

  await Message.deleteMany({ dialogueId: req.params.id });
  await Dialogue.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({ message: true });
}

module.exports = {
  getDialogue,
  createDialogue,
  deleteDialogue,
  getAllDialogues
};