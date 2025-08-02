import { Schema, Document } from "mongoose";

export class Coordinates {
  i: number = 0;
  q: number = 0;
  r: number = 0;
  s: number = 0;
}

export enum MoveType {
  Move = 0,
  DoublePawnPush = 1,
  Capture = 2,
  EnPassant = 3,
  EnPassantPromotion = 4,
  Promotion = 5,
  CapturePromotion = 6,
  CastleKingSide = 7,
  CastleQueenSide = 8,
}

export enum Piece {
  Pawn = 1,
  Knight = 2,
  Bishop = 3,
  Rook = 4,
  Queen = 5,
  King = 6,
}

export enum Color {
  White = 0,
  Gray = 1,
  Black = 2,
}

export interface IMove extends Document {
  _id: string;
  gameId: string;
  moveNumber: number;
  from: {
    i: number;
    q: number;
    r: number;
    s: number;
  };
  to: {
    i: number;
    q: number;
    r: number;
    s: number;
  };
  move_type: MoveType;
  color: Color;
  piece: Piece;
  timestamp: Date;
}

export interface IMoveLean {
  id: string;
  gameId: string;
  moveNumber: number;
  from: {
    i: number;
    q: number;
    r: number;
    s: number;
  };
  to: {
    i: number;
    q: number;
    r: number;
    s: number;
  };
  move_type: MoveType;
  color: Color;
  piece: Piece;
  timestamp: Date;
}

// Move Schema
export const MoveSchema = new Schema({
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  moveNumber: {
    type: Number,
    required: true,
    min: 1
  },
  from: {
    i: { type: Number, required: true },
    q: { type: Number, required: true },
    r: { type: Number, required: true },
    s: { type: Number, required: true }
  },
  to: {
    i: { type: Number, required: true },
    q: { type: Number, required: true },
    r: { type: Number, required: true },
    s: { type: Number, required: true }
  },
  move_type: {
    type: Number,
    enum: Object.values(MoveType).filter(x => typeof x === 'number'),
    required: true
  },
  color: {
    type: Number,
    enum: Object.values(Color).filter(x => typeof x === 'number'),
    required: true
  },
  piece: {
    type: Number,
    enum: Object.values(Piece).filter(x => typeof x === 'number'),
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

MoveSchema.index({ gameId: 1, moveNumber: 1 }, { unique: true }); 