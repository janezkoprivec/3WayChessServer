import mongoose, { Schema, Document } from 'mongoose';
import { IUser, UserSchema } from './db-models/user';
import { IGame, GameSchema } from './db-models/game';
import { IMove, MoveSchema } from './db-models/move';


// Create models using the imported model function
export const User = mongoose.model<IUser>('User', UserSchema);
export const Game = mongoose.model<IGame>('Game', GameSchema);
export const Move = mongoose.model<IMove>('Move', MoveSchema);
export { IGame, IUser, IMove };
