"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const Message = require('../models/Message');
const Dialogue = require('../models/Dialogue');
const CustomError = require('../errors');
const getMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield Message.findById(req.params.id);
    if (!message) {
        throw new CustomError.NotFoundError(`No message with id : ${req.params.id}`);
    }
    if (message.from !== req.user.userId) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ message });
});
const getAllMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.limit) || 1;
    const limit = 20;
    const dialogueId = req.params.dialogueId;
    const messages = yield Message.find({ dialogueId }).limit(limit * page);
    const dialogue = yield Dialogue.findById(dialogueId);
    if (!messages) {
        throw new CustomError.NotFoundError(`No dialogue with id : ${dialogueId}`);
    }
    if (!dialogue.users.includes(req.user.userId)) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ messages });
});
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text, to, dialogueId } = req.body;
    const dialogue = yield Dialogue.findById(dialogueId);
    if (!dialogue) {
        throw new CustomError.NotFoundError(`No dialogue with id : ${dialogueId}`);
    }
    if (!dialogue.users.includes(req.user.userId) || !dialogue.users.includes(to)) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    if (!text || !to || !dialogueId) {
        throw new CustomError.BadRequestError('Please, provide all values.');
    }
    const message = yield Message.create({
        from: req.user.userId,
        to,
        dialogueId,
        text,
        createdAt: new Date()
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ message });
});
const updateMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text, messageId } = req.body;
    const message = yield Message.findById(messageId);
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
    yield message.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ message });
});
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const message = yield Message.findById(id);
    if (!message) {
        throw new CustomError.NotFoundError(`No message with id : ${req.params.id}`);
    }
    if (message.from != req.user.userId) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    yield Message.findByIdAndDelete(id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: true });
});
module.exports = {
    getMessage,
    getAllMessages,
    createMessage,
    deleteMessage,
    updateMessage
};
