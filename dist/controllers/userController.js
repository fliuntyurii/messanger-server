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
const http_status_codes_1 = require("http-status-codes");
const User = require('../models/User');
const CustomError = require('../errors');
const { createTokenUser, attachCookiesToResponse, } = require('../utils');
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User.find({ role: 'user' }).select('-password');
    res.status(http_status_codes_1.StatusCodes.OK).json({ users });
});
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email } = req.params;
    const user = username ? yield User.findOne({ username }).select('-password') : yield User.findOne({ email }).select('-password');
    if (!user) {
        throw new CustomError.NotFoundError(`No user with username : ${req.body.username}`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        id: user._id,
        email: user.email,
        name: user.name,
        username: user.username,
        bio: user.bio,
        image: user.image
    });
});
const showCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: req.user });
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name } = req.body;
    if (!email || !name) {
        throw new CustomError.BadRequestError('Please provide all values');
    }
    const user = yield User.findOne({ _id: req.user.userId });
    user.email = email;
    user.name = name;
    yield user.save();
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: tokenUser });
});
const updateUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide both values');
    }
    const user = yield User.findOne({ _id: req.user.userId });
    const isPasswordCorrect = yield user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    user.password = newPassword;
    yield user.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
});
module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
};
