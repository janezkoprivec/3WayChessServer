import mongoose, { Schema, Document } from 'mongoose';

// Interfaces to extend Document
export interface IUser extends Document {
  id: string;
  username: string;
  profilePictureUrl?: string;
}

export interface IPlayer extends Document {
  id: string;
  user: IUser;
  color: string;
}

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

// User Schema
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  profilePictureUrl: { type: String, required: false }
}, {
  timestamps: true
});

// Player Schema
const PlayerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  color: { type: String, required: true }
}, {
  timestamps: true
});

// Game Schema
const GameSchema = new Schema({
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

// Create models using the imported model function
export const User = mongoose.model<IUser>('User', UserSchema);
export const Player = mongoose.model<IPlayer>('Player', PlayerSchema);
export const Game = mongoose.model<IGame>('Game', GameSchema);
