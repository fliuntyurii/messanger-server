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
const CustomError = require('../errors');
const Token = require('../models/Token');
const { isTokenValid } = require('../utils');
const { attachCookiesToResponse } = require('../utils');
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken, accessToken } = req.cookies;
    try {
        if (accessToken) {
            const payload = isTokenValid(accessToken);
            req.user = payload.user;
            return next();
        }
        const payload = isTokenValid(refreshToken);
        const existingToken = yield Token.findOne({
            user: payload.user.userId,
            refreshToken: payload.refreshToken
        });
        if (!existingToken || !(existingToken === null || existingToken === void 0 ? void 0 : existingToken.isValid)) {
            throw new CustomError.UnauthenticatedError('Authentication Invalid');
        }
        attachCookiesToResponse({ res, user: payload.user, refreshToken: existingToken.refreshToken });
        req.user = payload.user;
        next();
    }
    catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }
});
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError('Unauthorized to access this route');
        }
        next();
    };
};
module.exports = {
    authenticateUser,
    authorizePermissions,
};
