import mongoose from "mongoose";
import config from "../config/config";

async function initMongoose() {
  console.log('Initializing MongoDB connection...');
  
  const mongoUri = config.mongo.url;
  
  if (!mongoUri) {
    console.error('MongoDB URI is not properly configured');
    throw new Error("MongoDB URI is not properly configured");
  }
  
  console.log('Attempting to connect to MongoDB...');
  console.log(`Connection string: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials in logs
  
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
    await mongoose.connect(mongoUri, {
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
