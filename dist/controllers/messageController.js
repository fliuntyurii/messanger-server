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
exports.updateMessage = exports.deleteMessage = exports.createMessage = exports.getAllMessages = exports.getMessage = void 0;
const http_status_codes_1 = require("http-status-codes");
const Message_1 = require("../models/Message");
const Dialogue_1 = require("../models/Dialogue");
const errors_1 = __importDefault(require("../errors"));
const getMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield Message_1.Message.findById(req.params.id);
    if (!message) {
        throw new errors_1.default.NotFoundError(`No message with id : ${req.params.id}`);
    }
    if (message.from !== req.user.userId) {
        throw new errors_1.default.UnauthenticatedError('Invalid Credentials');
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ message });
});
exports.getMessage = getMessage;
const getAllMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.limit) || 1;
    const limit = 20;
    const dialogueId = req.params.dialogueId;
    const messages = yield Message_1.Message.find({ dialogueId }).limit(limit * page);
    const dialogue = yield Dialogue_1.Dialogue.findById(dialogueId);
    if (!messages) {
        throw new errors_1.default.NotFoundError(`No dialogue with id : ${dialogueId}`);
    }
    if (!(dialogue === null || dialogue === void 0 ? void 0 : dialogue.users.includes(req.user.userId))) {
        throw new errors_1.default.UnauthenticatedError('Invalid Credentials');
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ messages });
});
exports.getAllMessages = getAllMessages;
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text, to, dialogueId } = req.body;
    const dialogue = yield Dialogue_1.Dialogue.findById(dialogueId);
    if (!dialogue) {
        throw new errors_1.default.NotFoundError(`No dialogue with id : ${dialogueId}`);
    }
    if (!dialogue.users.includes(req.user.userId) || !dialogue.users.includes(to)) {
        throw new errors_1.default.UnauthenticatedError('Invalid Credentials');
    }
    if (!text || !to || !dialogueId) {
        throw new errors_1.default.BadRequestError('Please, provide all values.');
    }
    const message = yield Message_1.Message.create({
        from: req.user.userId,
        to,
        dialogueId,
        text,
        createdAt: new Date()
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ message });
});
exports.createMessage = createMessage;
const updateMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text, messageId } = req.body;
    const message = yield Message_1.Message.findById(messageId);
    if (!text || !messageId) {
        throw new errors_1.default.BadRequestError('Please, provide both values.');
    }
    if (!message) {
        throw new errors_1.default.NotFoundError(`No message with id : ${messageId}`);
    }
    if (message.from !== req.user.userId) {
        throw new errors_1.default.UnauthenticatedError('Invalid Credentials');
    }
    message.text = text;
    yield message.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ message });
});
exports.updateMessage = updateMessage;
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const message = yield Message_1.Message.findById(id);
    if (!message) {
        throw new errors_1.default.NotFoundError(`No message with id : ${req.params.id}`);
    }
    if (message.from != req.user.userId) {
        throw new errors_1.default.UnauthenticatedError('Invalid Credentials');
    }
    yield Message_1.Message.findByIdAndDelete(id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: true });
});
exports.deleteMessage = deleteMessage;
