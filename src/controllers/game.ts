import { IGame, IUser } from "../models/db-models";
import socketIO from "socket.io";
import { Game } from "../models/db-models";
import { IUserLean } from "../models/db-models/user";
import { IGameLean } from "../models/db-models/game";

export const gameController = (
  io: socketIO.Server,
  game: IGame & { _id: string },
  gameUpdated: () => void
) => {
  let currentGame: IGameLean | null = null;

  const gameNamespace = io.of(`/games/${game._id}`);
  const gameId = game._id;

  const updateCurrentGame = async (id?: string) => {
    let updatedGame = await Game.findById(id ?? currentGame?.id)
      .populate("players.user", "username email profilePictureUrl")
      .lean();

    if (updatedGame) {
      currentGame = {
        name: updatedGame.name,
        id: updatedGame._id.toString(),
        status: updatedGame.status,
        createdBy: updatedGame.createdBy,
        players: updatedGame.players.map((player) => ({
          user: {
            _id: player.user._id.toString(),
            email: player.user.email,
            username: player.user.username,
            profilePictureUrl: player.user.profilePictureUrl,
          },
          color: player.color,
        })) as [{ user: IUserLean; color: string }],
        timeControl: updatedGame.timeControl,
      };
    }
  };

  updateCurrentGame(gameId);

  gameNamespace.on("connection", (socket) => {
    socket.on("join", async (data) => {
      await handlePlayerJoin(data.player.user.id, data.player.color);

      if (currentGame && (currentGame.players as any[]).length === 3) {
        await handleGameStart();
      }

      gameNamespace.emit("game-updated", currentGame);
      gameUpdated();
    });

    socket.on("leave", async (data) => {
      await handlePlayerLeave(data.player.user.id);

      gameNamespace.emit("game-updated", currentGame);
      gameUpdated();
    });
  });

  const handlePlayerJoin = async (userId: string, color: string) => {
    if (
      currentGame?.players.find(
        (player) => player.user._id.toString() === userId
      ) === undefined
    ) {
  
      const updatedGame = await Game.findByIdAndUpdate(currentGame?.id, {
        $push: { players: { user: userId, color: color } },
      }).populate("players.user", "username email profilePictureUrl");
      if (updatedGame) {
        await updateCurrentGame();
      }
    }
  };
  
  const handlePlayerLeave = async (userId: string) => {
    const updatedGame = await Game.findByIdAndUpdate(currentGame?.id, {
      $pull: { players: { user: userId } },
    }).populate("players.user", "username email profilePictureUrl");
  
    if (updatedGame) {
      await updateCurrentGame();
    }
  };
  
  const handleGameStart = async () => {
    const updatedGame = await Game.findByIdAndUpdate(currentGame?.id, {
        $set: { status: "active" },
      })
      .populate("players.user", "username email profilePictureUrl");
  
    if (updatedGame) {
      await updateCurrentGame();
    }
  };
};


