import socketIO from "socket.io";
import { Game, IGame, Player } from "../models/db-models";
import { User } from "../models/db-models";
import { gameController } from "./game";

const gamesController = (io: socketIO.Server) => {
  const gamesNamespace = io.of("/games");

  gamesNamespace.on("connection", async (socket) => {
    broadcastGames(socket);
    socket.on("create", async (data) => {
      const game = await handleCreate(socket, data);
      if (game) {
        gameController(io, game as unknown as IGame & { _id: string });
      }
      broadcastGames(socket);
    });
  });

  const broadcastGames = async (socket: socketIO.Socket) => {
    try {
      const games = await Game.find({ status: "waiting" }).populate({
        path: "players",
        populate: {
          path: "user",
        },
      });

      socket.emit("waiting-games", games);
    } catch (err) {
      console.error("Error fetching games:", err);
      socket.emit("error", "Failed to fetch games");
    }
  };

  const handleCreate = async (socket: socketIO.Socket, data: any) => {
    const user = await User.findById(data.user.id);
    if (!user) {
      socket.emit("error", "User not found");
      return;
    }

    const player = await Player.create({
      user: user,
      color: data.selectedColor,
    });

    const game = await Game.create({
      name: data.gameName,
      status: "waiting",
      players: [player],
      createdBy: player._id,
      timeControl: data.timeControl,
    });

    socket.emit("game-created", game);

    broadcastGames(socket);

    return game;
  };
};

export default gamesController;
