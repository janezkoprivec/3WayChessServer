import { IGame, IPlayer, IUser, Player } from "../models/db-models";
import socketIO from "socket.io";
import { Game } from "../models/db-models";

export const gameController = (io: socketIO.Server, game: IGame & { _id: string }) => {
  const gameNamespace = io.of(`/games/${game._id}`);
  const gameId = game._id;

  gameNamespace.on("connection", (socket) => {
    socket.on("join", async (data) => {
      if (game.players.find((player) => player.user._id.toString() === data.player.user.id) === undefined) {
        const game = await handlePlayerJoin(data.player.user.id, data.player.color);
        gameNamespace.emit("game-updated", game);
      }
    });
  });

  const handlePlayerJoin = async (userId: string, color: string) => {
    const player = await Player.create({
      user: userId,
      color: color,
    });

    const game = await Game.findByIdAndUpdate(gameId, {
      $push: { players: player },
    });

    return game;
  };

};
