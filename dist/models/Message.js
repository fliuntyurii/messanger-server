"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MessageSchema = new mongoose_1.default.Schema({
    from: {
        type: String,
        ref: 'User',
        required: true
    },
    to: {
        type: String,
        ref: 'User',
        required: true
    },
    dialogueId: {
        type: String,
        ref: 'Dialogue',
        required: true
    },
    text: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100,
    },
    createdAt: {
        type: Date,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose_1.default.model('Message', MessageSchema);
