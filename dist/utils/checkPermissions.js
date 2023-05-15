"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermissions = void 0;
const errors_1 = __importDefault(require("../errors"));
const checkPermissions = (requestUser, resourceUserId) => {
    if (requestUser.role === 'admin' || requestUser.role === 'user')
        return;
    if (requestUser.userId === resourceUserId.toString())
        return;
    throw new errors_1.default.UnauthorizedError('Not authorized to access this route');
};
exports.checkPermissions = checkPermissions;
