import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.type';

const Message = require('../models/Message');
const Dialogue = require('../models/Dialogue');
const CustomError = require('../errors');

const getMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    throw new CustomError.NotFoundError(`No message with id : ${req.params.id}`);
  }

  if (message.from !== req.user.userId) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  res.status(StatusCodes.OK).json({ message });
}

const getAllMessages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const page = Number(req.query.limit) || 1;
  const limit = 20;

  const dialogueId = req.params.dialogueId;
  const messages = await Message.find({dialogueId}).limit(limit * page);
  const dialogue = await Dialogue.findById(dialogueId);

  if (!messages) {
    throw new CustomError.NotFoundError(`No dialogue with id : ${dialogueId}`);
  }

  if (!dialogue.users.includes(req.user.userId)) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  res.status(StatusCodes.OK).json({ messages });
}

const createMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { text, to, dialogueId } = req.body;
  const dialogue = await Dialogue.findById(dialogueId);

  if (!dialogue) {
    throw new CustomError.NotFoundError(`No dialogue with id : ${dialogueId}`);
  }

  if (!dialogue.users.includes(req.user.userId) || !dialogue.users.includes(to)) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  if (!text || !to || !dialogueId) {
    throw new CustomError.BadRequestError('Please, provide all values.');
  }

  const message = await Message.create({
    from: req.user.userId,
    to,
    dialogueId,
    text,
    createdAt: new Date()
  });

  res.status(StatusCodes.OK).json({ message });
}

const updateMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { text, messageId } = req.body;
  const message = await Message.findById(messageId);

  if (!text || !messageId) {
    throw new CustomError.BadRequestError('Please, provide both values.');
  }

  if (!message) {
    throw new CustomError.NotFoundError(`No message with id : ${messageId}`);
  }

  if (message.from !== req.user.userId) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  message.text = text;
  await message.save();

  res.status(StatusCodes.OK).json({ message });
}

const deleteMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const message = await Message.findById(id);

  if (!message) {
    throw new CustomError.NotFoundError(`No message with id : ${req.params.id}`);
  }

  if (message.from != req.user.userId) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  await Message.findByIdAndDelete(id);
  res.status(StatusCodes.OK).json({ message: true });
}

module.exports = {
  getMessage,
  getAllMessages,
  createMessage,
  deleteMessage,
  updateMessage
};