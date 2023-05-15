"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachCookiesToResponse = exports.isTokenValid = exports.createJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createJWT = ({ payload }) => {
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET);
    return token;
};
exports.createJWT = createJWT;
const isTokenValid = (token) => {
    const secret = process.env.JWT_SECRET || 'default-secret';
    return jsonwebtoken_1.default.verify(token, secret);
    ;
};
exports.isTokenValid = isTokenValid;
const attachCookiesToResponse = ({ res, user, refreshToken }) => {
    const accessTokenJWT = createJWT({ payload: { user } });
    const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });
    const shortExp = 1000 * 60 * 60;
    const longerExp = 1000 * 60 * 60 * 24 * 7;
    res.cookie('accessToken', accessTokenJWT, {
        httpOnly: false,
        expires: new Date(Date.now() + shortExp),
    });
    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: false,
        expires: new Date(Date.now() + longerExp),
    });
};
exports.attachCookiesToResponse = attachCookiesToResponse;
