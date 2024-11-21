import { Schema } from "mongoose";
import { IUser } from "./user";

export interface IPlayer extends Document {
  _id: string;
  user: IUser;
  color: string;
}

// Player Schema
export const PlayerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  color: { type: String, required: true }
}, {
  timestamps: true
});

