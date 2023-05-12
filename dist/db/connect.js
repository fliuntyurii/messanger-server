"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose = require('mongoose');
const connectDB = (url) => {
    return mongoose.connect(url);
};
exports.connectDB = connectDB;
