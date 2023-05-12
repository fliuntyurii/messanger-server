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
const http_status_codes_1 = require("http-status-codes");
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mailSandler = require('../utils/mailSandler');
const User = require('../models/User');
const Token = require('../models/Token');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password, username, bio, image, language } = req.body;
    if (!email || !name || !password) {
        throw new CustomError.BadRequestError('Please provide email and password');
    }
    const emailAlreadyExists = yield User.findOne({ email });
    if (emailAlreadyExists) {
        throw new CustomError.BadRequestError('Email already exists');
    }
    const role = 'user';
    const verificationToken = crypto_1.default.randomBytes(40).toString('hex');
    const isVerified = false;
    const user = yield User.create({
        email,
        name,
        username,
        password,
        bio,
        image,
        language,
        role,
        verificationToken,
        isVerified
    });
    const tokenUser = createTokenUser(user);
    const message = `<i>Hello, ${name}. To complete your sign up, please verify your email: 
    <a href="http://${process.env.CLIENT_URL}/verify?token=${user.verificationToken}&id=${user._id}">CLICK</a>.
    PUSLE MESSANGER!</i>`;
    yield mailSandler(email, 'Verify Your Email', message);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ user: tokenUser });
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new CustomError.BadRequestError('Please provide email and password');
    }
    const user = yield User.findOne({ email });
    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    const isPasswordCorrect = yield user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    const tokenUser = createTokenUser(user);
    let refreshToken = '';
    const existingToken = yield Token.findOne({ user: user._id });
    if (existingToken) {
        const { isValid } = existingToken;
        if (!isValid) {
            throw new CustomError.UnauthenticatedError('Invalid Credentials');
        }
        refreshToken = existingToken.refreshToken;
        attachCookiesToResponse({ res, user: tokenUser, refreshToken });
        res.status(http_status_codes_1.StatusCodes.OK).json({ user: tokenUser });
        return;
    }
    refreshToken = crypto_1.default.randomBytes(40).toString('hex');
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const userToken = { refreshToken, ip, userAgent, user: user._id };
    yield Token.create(userToken);
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: tokenUser });
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Token.findOneAndDelete({ user: req.user.userId });
    res.cookie('accessToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ logout: true });
});
const verifyAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, token } = req.body;
    const user = yield User.findByIdAndUpdate({ _id: id }, { isVerified: true });
    if (!user || token !== user.verificationToken) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    if (user.isVerified) {
        throw new CustomError.UnauthenticatedError('User is already verified!');
    }
    yield user.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'Email verified success!' });
});
const resendMsgToVerify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    if (!email) {
        throw new CustomError.BadRequestError('Please provide email and password');
    }
    const user = yield User.findOne({ email });
    if (user.isVerified) {
        throw new CustomError.UnauthenticatedError('The user is already verified!');
    }
    const message = `<i>Hello, ${user.name}. To complete your sign up, please verify your email: 
    <a href="http://${process.env.CLIENT_URL}/verify?token=${user.verificationToken}&id=${user._id}">CLICK</a>.
    PUSLE MESSANGER!</i>`;
    yield mailSandler(email, 'Verify Your Email', message);
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'Check your email!' });
});
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    if (!email) {
        throw new CustomError.BadRequestError('Please provide email');
    }
    const user = yield User.findOne({ email });
    if (!user) {
        throw new CustomError.NotFoundError(`No user with email : ${email}`);
    }
    const passwordToken = crypto_1.default.randomBytes(70).toString('hex');
    const passwordTokenExpirationDate = new Date(Date.now() + 1000 * 60 * 10);
    user.passwordToken = passwordToken;
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    yield user.save();
    const message = `<i>Follow the link to reset password: 
    <a href="http://${process.env.CLIENT_URL}/reset-password?token=${user.passwordToken}&email=${email}">LINK</a>.
    PUSLE MESSANGER!</i>`;
    yield mailSandler(email, 'Reset Password', message);
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'Check your email!' });
});
const updateForgottenPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, email } = req.query;
    const { password } = req.body;
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashPassword = yield bcryptjs_1.default.hash(password, salt);
    const user = yield User.findOne({ email });
    if (!password) {
        throw new CustomError.BadRequestError('Please provide password');
    }
    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    if (user.passwordToken !== token) {
        throw new CustomError.UnauthenticatedError('Token has expired');
    }
    user.password = hashPassword;
    user.passwordToken = null;
    user.passwordTokenExpirationDate = null;
    yield user.save();
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: tokenUser });
});
const isUserExist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email } = req.query;
    let user;
    if (username) {
        user = yield User.findOne({ username });
    }
    if (email) {
        user = yield User.findOne({ email });
    }
    if (!user) {
        res.status(http_status_codes_1.StatusCodes.OK).json({ exist: false });
        return;
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ exist: true });
});
module.exports = {
    register,
    login,
    verifyAccount,
    resendMsgToVerify,
    logout,
    forgotPassword,
    updateForgottenPassword,
    isUserExist
};
