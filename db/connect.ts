const mongoose = require('mongoose');

export const connectDB = (url: string | undefined) => {
  return mongoose.connect(url);
};