import { Schema } from "mongoose";
import { IPlayer } from "./player";

export interface IGame extends Document {
  id: string;
  name: string;
  status: "active" | "waiting" | "finished";
  players: IPlayer[];
  createdBy: IPlayer;
  timeControl: {
    type: "rapid" | "blitz" | "bullet";
    time: number;
    increment: number;
  };
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
    type: Schema.Types.ObjectId,
    ref: 'Player'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
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
  }
}, {
  timestamps: true
});