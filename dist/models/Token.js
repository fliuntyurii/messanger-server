"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const tokenSchema = new Schema({
    user: {
        type: String,
        ref: 'User',
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    isValid: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
module.exports = mongoose_1.default.model('Token', tokenSchema);
