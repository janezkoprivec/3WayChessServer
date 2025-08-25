import { NextFunction, Request, Response } from "express";
import { Game, Move } from "../models/db-models";

const getUserGames = async (req: Request, res: Response) => {
  try {
    const authenticatedUserId = res.locals.jwt.userId;
    const targetPlayerId = req.query.playerId as string || authenticatedUserId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const games = await Game.find({
      "players.user": targetPlayerId,
      status: "finished"
    })
    .populate("players.user", "username profilePictureUrl")
    .populate("createdBy", "username profilePictureUrl")
    .select("name status players timeControl createdAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const totalGames = await Game.countDocuments({
      "players.user": targetPlayerId,
      status: "finished"
    });

    const totalPages = Math.ceil(totalGames / limit);

    console.log(games);

    res.status(200).json({
      games,
      pagination: {
        currentPage: page,
        totalPages,
        totalGames,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message, error });
  }
};

const getGameMoves = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const userId = res.locals.jwt.userId;

    const game = await Game.findOne({
      _id: gameId,
      "players.user": userId
    })
    .populate("players.user", "username profilePictureUrl")
    .populate("createdBy", "username profilePictureUrl")
    .select("name status players timeControl createdAt");

    if (!game) {
      res.status(404).json({ message: "Game not found or access denied" });
      return;
    }

    const moves = await Move.find({ gameId })
      .select("moveNumber from to move_type color piece timestamp")
      .sort({ moveNumber: 1 });

    res.status(200).json({
      gameId,
      name: game.name,
      players: game.players,
      moves,
      totalMoves: moves.length
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message, error });
  }
};

export default {
  getUserGames,
  getGameMoves,
}; 