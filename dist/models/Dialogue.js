"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dialogue = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DialogueSchema = new mongoose_1.default.Schema({
    users: {
        type: [],
        default: []
    },
    messages: {
        type: [],
        default: []
    }
});
exports.Dialogue = mongoose_1.default.model('Dialogue', DialogueSchema);
