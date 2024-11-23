import { Schema } from "mongoose";
import mongoose from "mongoose";

export interface IUser extends Document {
  _id: string;
  email: string;
  username: string;
  profilePictureUrl: string;
  password: string;
}

export interface IUserLean {
  _id: string;
  email: string;
  username: string;
  profilePictureUrl: string;
}

export const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePictureUrl: { type: String, required: false },
}, { timestamps: true });

