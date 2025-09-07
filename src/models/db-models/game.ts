import { Schema } from "mongoose";
import { IUser, IUserLean } from "./user";

export interface IGameTimeControl {
  type: "rapid" | "blitz" | "bullet";
  time: number;
  increment: number;
}

export interface IGame extends Document {
  _id: string;
  name: string;
  status: "active" | "waiting" | "finished";
  players: [{
    user: IUserLean;
    color: string;
  }];
  createdBy: IUserLean;
  timeControl: IGameTimeControl;
  fen?: string; 
}

export interface IGameLean {
  id: string;
  name: string;
  status: "active" | "waiting" | "finished";
  players: [{
    user: IUserLean;
    color: string;
  }];
  createdBy: IUserLean;
  timeControl: IGameTimeControl;
  fen?: string; 
}

// Game Schema
export const GameSchema = new Schema({
  name: { type: String, required: false },
  status: {
    type: String,
    enum: ["active", "waiting", "finished"],
    required: true,
    default: "waiting"
  },
  players: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    color: { type: String, required: true }
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timeControl: {
    type: {
      type: String,
      enum: ["rapid", "blitz", "bullet"],
      required: true
    },
    time: {
      type: Number,
      required: true,
      min: 0
    },
    increment: {
      type: Number,
      required: true,
      min: 0
    }
  },
  fen: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});