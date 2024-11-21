import mongoose, { Schema, Document } from 'mongoose';
import { IUser, UserSchema } from './db-models/user';
import { IGame, GameSchema } from './db-models/game';
import { IPlayer, PlayerSchema } from './db-models/player';


// Create models using the imported model function
export const User = mongoose.model<IUser>('User', UserSchema);
export const Player = mongoose.model<IPlayer>('Player', PlayerSchema);
export const Game = mongoose.model<IGame>('Game', GameSchema);
export { IGame, IUser, IPlayer };
