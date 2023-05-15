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
exports.updateUserPassword = exports.updateUser = exports.showCurrentUser = exports.getSingleUser = exports.getAllUsers = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../models/User");
const errors_1 = __importDefault(require("../errors"));
const utils_1 = require("../utils");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.User.find({ role: 'user' }).select('-password');
    res.status(http_status_codes_1.StatusCodes.OK).json({ users });
});
exports.getAllUsers = getAllUsers;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email } = req.params;
    const user = username ? yield User_1.User.findOne({ username }).select('-password') : yield User_1.User.findOne({ email }).select('-password');
    if (!user) {
        throw new errors_1.default.NotFoundError(`No user with username : ${req.body.username}`);
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
exports.getSingleUser = getSingleUser;
const showCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: req.user });
});
exports.showCurrentUser = showCurrentUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name } = req.body;
    if (!email || !name) {
        throw new errors_1.default.BadRequestError('Please provide all values');
    }
    const user = yield User_1.User.findOne({ _id: req.user.userId });
    if (!user) {
        throw new errors_1.default.NotFoundError('User doesn\'t exist');
    }
    user.email = email;
    user.name = name;
    yield user.save();
    const tokenUser = (0, utils_1.createTokenUser)(user);
    (0, utils_1.attachCookiesToResponse)({ res, user: tokenUser });
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: tokenUser });
});
exports.updateUser = updateUser;
const updateUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new errors_1.default.BadRequestError('Please provide both values');
    }
    const user = yield User_1.User.findOne({ _id: req.user.userId });
    const isPasswordCorrect = yield (user === null || user === void 0 ? void 0 : user.comparePassword(oldPassword));
    if (!isPasswordCorrect) {
        throw new errors_1.default.UnauthenticatedError('Invalid Credentials');
    }
    if (user) {
        user.password = newPassword;
        yield user.save();
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
});
exports.updateUserPassword = updateUserPassword;
