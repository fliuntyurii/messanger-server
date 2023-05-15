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
exports.authorizePermissions = exports.authenticateUser = void 0;
const errors_1 = __importDefault(require("../errors"));
const Token_1 = require("../models/Token");
const utils_1 = require("../utils");
const utils_2 = require("../utils");
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken, accessToken } = req.cookies;
    try {
        if (accessToken) {
            const payload = (0, utils_1.isTokenValid)(accessToken);
            if (typeof payload !== 'string') {
                req.user = payload.user;
                return next();
            }
        }
        const payload = (0, utils_1.isTokenValid)(refreshToken);
        if (typeof payload === 'string') {
            throw new errors_1.default.UnauthenticatedError('Authentication Invalid');
        }
        else {
            const existingToken = yield Token_1.Token.findOne({
                user: payload.user.userId,
                refreshToken: payload.refreshToken
            });
            if (!existingToken || !(existingToken === null || existingToken === void 0 ? void 0 : existingToken.isValid)) {
                throw new errors_1.default.UnauthenticatedError('Authentication Invalid');
            }
            (0, utils_2.attachCookiesToResponse)({ res, user: payload.user, refreshToken: existingToken.refreshToken });
            req.user = payload.user;
            next();
        }
    }
    catch (error) {
        throw new errors_1.default.UnauthenticatedError('Authentication Invalid');
    }
});
exports.authenticateUser = authenticateUser;
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new errors_1.default.UnauthorizedError('Unauthorized to access this route');
        }
        next();
    };
};
exports.authorizePermissions = authorizePermissions;
