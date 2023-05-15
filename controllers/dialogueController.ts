import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';

import { AuthenticatedRequest } from '../types/index.type';
import { Dialogue } from '../models/Dialogue';
import { Message } from '../models/Message';
import CustomError from '../errors';
import { User } from '../models/User';

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
    req.userId2 = user;
    createDialogue(req, res);
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

const createDialogue = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId1 = req.user.userId;
  const userId2 = req.userId2;

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

  if(user1 && user2) {
    user1.dialogues = [...user1.dialogues, String(dialogue._id)]; 
    await user1.save();
    user2.dialogues = [...user2.dialogues, String(dialogue._id)];
    await user2.save();
  }

  res.status(StatusCodes.OK).json({ dialogue });
}

const deleteDialogue = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const dialogue = await Dialogue.findById(req.params.id);

  const user1 = await User.findById(dialogue?.users[0]);
  const user2 = await User.findById(dialogue?.users[1]);

  if (!dialogue) {
    throw new CustomError.NotFoundError(`No dialogue with id : ${req.params.id}`);
  }

  if (!dialogue.users.includes(req.user.userId)) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  if(user1 && user2) {
    user1.dialogues = user1.dialogues.filter((d: string) => d != String(dialogue._id));
    await user1.save();
    user2.dialogues = user2.dialogues.filter((d: string) => d != String(dialogue._id));
    await user2.save();
  }

  await Message.deleteMany({ dialogueId: req.params.id });
  await Dialogue.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({ message: true });
}

export {
  getDialogue,
  createDialogue,
  deleteDialogue,
  getAllDialogues
};