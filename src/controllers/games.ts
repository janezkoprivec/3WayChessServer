import socketIO from "socket.io";
import { Game, Player } from "../models/db-models";
import { Mongoose } from "mongoose";
import { User } from "../models/db-models";

const gamesController = (io: socketIO.Server) => {
  const gamesNamespace = io.of("/games");

  gamesNamespace.on("connection", async (socket) => {
    broadcastGames(socket);
    socket.on("create", (data) => {
      handleCreate(socket, data);
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
    console.log("create game", data);

    const user = await User.findById(data.user._id);
    if (!user) {
      socket.emit("error", "User not found");
      return;
    }

    const player = await Player.create({
      user: user._id,
      color: data.selectedColor,
    });

    const game = await Game.create({
      name: data.gameName,
      status: "waiting",
      players: [player._id],
      createdBy: player._id,
      timeControl: data.timeControl,
    });

    broadcastGames(socket);
  };
};

export default gamesController;
