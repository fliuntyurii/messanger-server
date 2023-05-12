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
const Dialogue = require('../models/Dialogue');
const Message = require('../models/Message');
const CustomError = require('../errors');
const User = require('../models/User');
const getDialogue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body.id;
    const dialogue = (yield Dialogue.findById(req.params.id)) ||
        (yield Dialogue.findOne({ users: [req.user.userId, user] })) ||
        (yield Dialogue.findOne({ users: [user, req.user.userId] }));
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
    res.status(http_status_codes_1.StatusCodes.OK).json({ dialogue });
});
const getAllDialogues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = req.user.dialogues;
    if (!ids || !ids.length) {
        throw new CustomError.BadRequestError('Please, provide dialogues ids.');
    }
    const dialogues = yield Dialogue.find({ _id: { $in: ids } });
    if (!dialogues) {
        throw new CustomError.NotFoundError(`No dialogues with id : ${ids}`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ dialogues });
});
const createDialogue = (req, res, userId2) => __awaiter(void 0, void 0, void 0, function* () {
    const userId1 = req.user.userId;
    if (!userId2) {
        throw new CustomError.BadRequestError('Please, provide user id.');
    }
    if (userId1 === userId2) {
        throw new CustomError.BadRequestError('Something went wrong.');
    }
    const user1 = yield User.findById(userId1);
    const user2 = yield User.findById(userId2);
    const dialogue = yield Dialogue.create({
        users: [
            userId1, userId2
        ],
        messages: []
    });
    user1.dialogues.push(String(dialogue._id));
    yield user1.save();
    user2.dialogues.push(String(dialogue._id));
    yield user2.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ dialogue });
});
const deleteDialogue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dialogue = yield Dialogue.findById(req.params.id);
    const user1 = yield User.findById(dialogue.users[0]);
    const user2 = yield User.findById(dialogue.users[1]);
    if (!dialogue) {
        throw new CustomError.NotFoundError(`No dialogue with id : ${req.params.id}`);
    }
    if (!dialogue.users.includes(req.user.userId)) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    user1.dialogues = user1.dialogues.filter((d) => d != String(dialogue._id));
    yield user1.save();
    user2.dialogues = user2.dialogues.filter((d) => d != String(dialogue._id));
    yield user2.save();
    yield Message.deleteMany({ dialogueId: req.params.id });
    yield Dialogue.findByIdAndDelete(req.params.id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: true });
});
module.exports = {
    getDialogue,
    createDialogue,
    deleteDialogue,
    getAllDialogues
};
