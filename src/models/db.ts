import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function initMongoose() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }
  
  await mongoose.connect(process.env.MONGO_URI);
  return mongoose;
}

export default initMongoose;
