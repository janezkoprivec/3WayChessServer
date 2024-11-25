import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function initMongoose() {
  console.log('Initializing MongoDB connection...');
  
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in environment variables');
    throw new Error("MONGO_URI is not defined");
  }
  
  console.log('Attempting to connect to MongoDB...');
  
  mongoose.connection.on('connecting', () => {
    console.log('Connecting to MongoDB...');
  });

  mongoose.connection.on('connected', () => {
    console.log('Successfully connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 2000,
    });
    
    console.log('MongoDB connection established successfully');
    return mongoose;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export default initMongoose;
