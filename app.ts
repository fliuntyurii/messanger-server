require('dotenv').config();
require('express-async-errors');
const rateLimit =  require('express-rate-limit');

import express from 'express';
import http from 'http';
import mongoose from 'mongoose';

import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';

import { connectDB } from './db/connect';

import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';
import messageRouter from './routes/messageRoutes';
import dialogueRouter from './routes/dialogueRoutes';

import notFoundMiddleware from './middleware/not-found';
import errorHandlerMiddleware from './middleware/error-handler';

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);


io.on('connection', (socket: any) => {
  console.log('a user connected');
  socket.on('chat message', (msg: any) => {
    console.log('message: ' + msg);
  });
});

app.set('trust proxy', 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors({
  origin: `${process.env.CLIENT_URL}`,
  credentials: true
}));
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser());

app.use(fileUpload());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/message', messageRouter);
app.use('/api/v1/dialogue', dialogueRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

mongoose.set('strictQuery', true);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL || '');
    
    server.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
