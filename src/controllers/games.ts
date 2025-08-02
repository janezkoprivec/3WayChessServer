import socketIO from "socket.io";
import { Game, IGame, User, Move } from "../models/db-models";
import { gameController } from "./game";

const onInitServer = async (io: socketIO.Server, gameUpdated: () => void) => {
  const waitingGames = await Game.find({ status: "waiting" })
    .populate('players.user', 'username email profilePictureUrl')
    .populate('createdBy', 'username email profilePictureUrl')
    .lean();

  for (const game of waitingGames) {
    gameController(io, game as unknown as IGame & { _id: string }, gameUpdated);
  }
};

const gamesController = (io: socketIO.Server) => {
  const gamesNamespace = io.of("/games");


  const broadcastGames = async () => {
    try {
      let games = await Game.find({ status: "waiting" })
        .populate('players.user', 'username email profilePictureUrl')
        .populate('createdBy', 'username email profilePictureUrl')
        .lean();

      games = games.map((game) => ({
        ...game,
        id: game._id.toString(),
      }));

      gamesNamespace.emit("waiting-games", games);
    } catch (err) {
      console.error("Error fetching games:", err);
      gamesNamespace.emit("error", "Failed to fetch games");
    }
  };
  
  onInitServer(io, broadcastGames);


  gamesNamespace.on("connection", async (socket) => {
    broadcastGames();
    socket.on("create", async (data) => {
      const game = await handleCreate(socket, data);
      if (game) {
        gameController(io, game as unknown as IGame & { _id: string }, broadcastGames);
      }
      broadcastGames();
    });
  });

  const handleCreate = async (socket: socketIO.Socket, data: any) => {
    const user = await User.findById(data.user.id);
    if (!user) {
      socket.emit("error", "User not found");
      return;
    }



    const game = await Game.create({
      name: data.gameName,
      status: "waiting",
      players: [{
        user: user._id,
        color: data.selectedColor,
      }],
      createdBy: user._id,
      timeControl: data.timeControl,
    });


    socket.emit("game-created", game);

    broadcastGames();

    return game;
  };
};

export default gamesController;
