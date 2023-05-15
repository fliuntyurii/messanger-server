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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDialogues = exports.deleteDialogue = exports.createDialogue = exports.getDialogue = void 0;
const http_status_codes_1 = require("http-status-codes");
const Dialogue_1 = require("../models/Dialogue");
const Message_1 = require("../models/Message");
const errors_1 = __importDefault(require("../errors"));
const User_1 = require("../models/User");
const getDialogue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body.id;
    const dialogue = (yield Dialogue_1.Dialogue.findById(req.params.id)) ||
        (yield Dialogue_1.Dialogue.findOne({ users: [req.user.userId, user] })) ||
        (yield Dialogue_1.Dialogue.findOne({ users: [user, req.user.userId] }));
    if (!req.params.id) {
        throw new errors_1.default.BadRequestError('Please, provide dialogue id.');
    }
    if (!dialogue) {
        if (!user) {
            throw new errors_1.default.BadRequestError('Please, provide user id to create dialogue.');
        }
        req.userId2 = user;
        createDialogue(req, res);
        return;
    }
    if (!dialogue.users.includes(req.user.userId)) {
        throw new errors_1.default.UnauthenticatedError('Invalid Credentials');
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ dialogue });
});
exports.getDialogue = getDialogue;
const getAllDialogues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = req.user.dialogues;
    if (!ids || !ids.length) {
        throw new errors_1.default.BadRequestError('Please, provide dialogues ids.');
    }
    const dialogues = yield Dialogue_1.Dialogue.find({ _id: { $in: ids } });
    if (!dialogues) {
        throw new errors_1.default.NotFoundError(`No dialogues with id : ${ids}`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ dialogues });
});
exports.getAllDialogues = getAllDialogues;
const createDialogue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId1 = req.user.userId;
    const userId2 = req.userId2;
    if (!userId2) {
        throw new errors_1.default.BadRequestError('Please, provide user id.');
    }
    if (userId1 === userId2) {
        throw new errors_1.default.BadRequestError('Something went wrong.');
    }
    const user1 = yield User_1.User.findById(userId1);
    const user2 = yield User_1.User.findById(userId2);
    const dialogue = yield Dialogue_1.Dialogue.create({
        users: [
            userId1, userId2
        ],
        messages: []
    });
    if (user1 && user2) {
        user1.dialogues = [...user1.dialogues, String(dialogue._id)];
        yield user1.save();
        user2.dialogues = [...user2.dialogues, String(dialogue._id)];
        yield user2.save();
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ dialogue });
});
exports.createDialogue = createDialogue;
const deleteDialogue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dialogue = yield Dialogue_1.Dialogue.findById(req.params.id);
    const user1 = yield User_1.User.findById(dialogue === null || dialogue === void 0 ? void 0 : dialogue.users[0]);
    const user2 = yield User_1.User.findById(dialogue === null || dialogue === void 0 ? void 0 : dialogue.users[1]);
    if (!dialogue) {
        throw new errors_1.default.NotFoundError(`No dialogue with id : ${req.params.id}`);
    }
    if (!dialogue.users.includes(req.user.userId)) {
        throw new errors_1.default.UnauthenticatedError('Invalid Credentials');
    }
    if (user1 && user2) {
        user1.dialogues = user1.dialogues.filter((d) => d != String(dialogue._id));
        yield user1.save();
        user2.dialogues = user2.dialogues.filter((d) => d != String(dialogue._id));
        yield user2.save();
    }
    yield Message_1.Message.deleteMany({ dialogueId: req.params.id });
    yield Dialogue_1.Dialogue.findByIdAndDelete(req.params.id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: true });
});
exports.deleteDialogue = deleteDialogue;
