import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cloud-advisor';
  mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
}
