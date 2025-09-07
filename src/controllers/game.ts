import { IGame, IUser, Move } from "../models/db-models";
import socketIO from "socket.io";
import { Game } from "../models/db-models";
import { IUserLean } from "../models/db-models/user";
import { IGameLean } from "../models/db-models/game";
import { MoveType, Piece, Color } from "../models/db-models/move";
import { Game as ChessGame, GameState, Color as WasmColor, Move as WasmMove, Coordinates } from "main-chess-lib";

export const gameController = (
  io: socketIO.Server,
  game: IGame & { _id: string },
  gameUpdated: () => void
) => {
  let currentGame: IGameLean | null = null;
  let chessGame: ChessGame | null = null;
  let currentTurn: string | null = null;
  let playerTimes: Map<string, number> = new Map();
  let lastMoveTime: Date | null = null;

  const gameNamespace = io.of(`/games/${game._id}`);
  const gameId = game._id;

  const colorStringToWasm = (colorStr: string): WasmColor => {
    switch (colorStr.toLowerCase()) {
      case 'white': return WasmColor.White;
      case 'grey': return WasmColor.Gray;
      case 'black': return WasmColor.Black;
      default: return WasmColor.White;
    }
  };

  const wasmColorToString = (wasmColor: WasmColor): string => {
    switch (wasmColor) {
      case WasmColor.White: return 'white';
      case WasmColor.Gray: return 'grey';
      case WasmColor.Black: return 'black';
      default: return 'white';
    }
  };

  const initializeChessGame = async () => {
    try {
      if (currentGame?.fen) {
        chessGame = ChessGame.new(currentGame.fen);
      } else {
        chessGame = ChessGame.newDefault();
        
        const initialFen = chessGame.getFen();
        await Game.findByIdAndUpdate(gameId, { fen: initialFen });
        
        if (currentGame) {
          currentGame.fen = initialFen;
        }
      }
    } catch (error) {
      console.error('Error initializing WASM game:', error);
      chessGame = ChessGame.newDefault();
    }
  };

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
        fen: updatedGame.fen,
      };
      
      await initializeChessGame();
    }
  };

  updateCurrentGame(gameId);

  const timeUpdateInterval = setInterval(() => {
    if (currentGame?.status === "active" && currentTurn && lastMoveTime) {
      gameNamespace.emit("time-updated", {
        playerTimes: Object.fromEntries(playerTimes),
        currentTurn,
        elapsedSinceLastMove: getElapsedTime()
      });
    }
  }, 1000);

  gameNamespace.on("connection", (socket) => {
    socket.on("join", async (data) => {
      await handlePlayerJoin(data.player.user.id, data.player.color);

      if (currentGame && (currentGame.players as any[]).length === 3) {
        await handleGameStart();
      } else if (currentGame?.status === "active") {
        const initialTime = currentGame.timeControl.time;
        playerTimes.set(data.player.color, initialTime);
        
        syncTurnWithGameState();
        
        socket.emit("turn-updated", {
          currentTurn,
          playerTimes: Object.fromEntries(playerTimes),
          timeControl: currentGame.timeControl
        });
      }

      gameNamespace.emit("game-updated", currentGame);
      gameUpdated();
    });

    socket.on("leave", async (data) => {
      await handlePlayerLeave(data.player.user.id);

      gameNamespace.emit("game-updated", currentGame);
      gameUpdated();
    });

    socket.on("move", async (data) => {
      try {
        await saveMove(data);
        
        gameNamespace.emit("move", data);
      } catch (error) {
        console.error('Error handling move:', error);
        socket.emit("move-error", { message: "Failed to save move" });
      }
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
      
      if (currentGame && currentGame.players.length <= 0) {
        console.log(`Game ${gameId} has no players left, deleting game...`);
        
        try {
          await Move.deleteMany({ gameId });
          console.log(`Deleted all moves for game ${gameId}`);
          
          await Game.findByIdAndDelete(gameId);
          console.log(`Deleted game ${gameId}`);
          
          gameNamespace.emit("game-deleted", { 
            message: "Game deleted - no players remaining" 
          });
          
          clearInterval(timeUpdateInterval);
          
          gameUpdated();
          
        } catch (error) {
          console.error('Error deleting game:', error);
        }
      }
    }
  };
  
  const handleGameStart = async () => {
    const updatedGame = await Game.findByIdAndUpdate(currentGame?.id, {
        $set: { status: "active" },
      })
      .populate("players.user", "username email profilePictureUrl");
  
    if (updatedGame) {
      await updateCurrentGame();
      if (currentGame && currentGame.players.length > 0) {
        syncTurnWithGameState();
        lastMoveTime = new Date();
        
        console.log("Initializing player times", currentGame.timeControl.time);
        const initialTime = currentGame.timeControl.time;
        currentGame.players.forEach(player => {
          playerTimes.set(player.color, initialTime);
          console.log(`Set ${player.color} time to ${initialTime}s`);
        });
        
        gameNamespace.emit("turn-updated", { 
          currentTurn,
          playerTimes: Object.fromEntries(playerTimes),
          timeControl: currentGame.timeControl
        });
      }
    }
  };

  const getNextMoveNumber = async (gameId: string): Promise<number> => {
    const lastMove = await Move.findOne({ gameId }).sort({ moveNumber: -1 }).limit(1);
    return lastMove ? Number(lastMove.moveNumber) + 1 : 1;
  };

  const getCurrentTurnFromGameState = (): string | null => {
    if (!chessGame) return null;
    
    try {
      const gameState = chessGame.getGameState();
      return wasmColorToString(gameState.turn);
    } catch (error) {
      console.error('Error getting game state:', error);
      return null;
    }
  };

  const syncTurnWithGameState = () => {
    const gameTurn = getCurrentTurnFromGameState();
    if (gameTurn && gameTurn !== currentTurn) {
      currentTurn = gameTurn;
    }
  };

  const updatePlayerTime = (playerColor: string, elapsedSeconds: number) => {
    const currentTime = playerTimes.get(playerColor) || 0;
    const increment = currentGame?.timeControl.increment || 0;
    const newTime = Math.max(0, currentTime - elapsedSeconds + increment);
    console.log(`Updating time for ${playerColor}: ${currentTime}s - ${elapsedSeconds}s + ${increment}s = ${newTime}s`);
    playerTimes.set(playerColor, newTime);
  };

  const getElapsedTime = (): number => {
    if (!lastMoveTime) return 0;
    const elapsed = Math.floor((Date.now() - lastMoveTime.getTime()) / 1000);
    return elapsed;
  };

  const validateMove = (moveData: {
    from: { i: number; q: number; r: number; s: number };
    to: { i: number; q: number; r: number; s: number };
    move_type: MoveType;
    color: Color;
    piece: Piece;
  }): { isValid: boolean; validMoves?: WasmMove[]; error?: string } => {
    if (!chessGame) {
      return { isValid: false, error: 'Chess game not initialized' };
    }

    try {
      const gameState = chessGame.getGameState();
      const expectedColor = colorStringToWasm(wasmColorToString(gameState.turn));
      if (moveData.color !== expectedColor) {
        return { 
          isValid: false, 
          error: `Not ${wasmColorToString(moveData.color)}'s turn` 
        };
      }

      const allValidMoves = chessGame.queryAllMoves();
      const validMovesFromPosition = allValidMoves.filter(move =>
        move.from.i === moveData.from.i &&
        move.from.q === moveData.from.q &&
        move.from.r === moveData.from.r &&
        move.from.s === moveData.from.s
      );
      
      const moveExists = validMovesFromPosition.some(validMove => 
        validMove.to.i === moveData.to.i &&
        validMove.to.q === moveData.to.q &&
        validMove.to.r === moveData.to.r &&
        validMove.to.s === moveData.to.s &&
        validMove.move_type === moveData.move_type
      );

      return { 
        isValid: moveExists, 
        validMoves: validMovesFromPosition,
        error: moveExists ? undefined : 'Invalid move' 
      };
    } catch (error) {
      console.error('Error validating move:', error);
      return { isValid: false, error: 'Move validation failed' };
    }
  };

  const saveMove = async (moveData: {
    from: { i: number; q: number; r: number; s: number };
    to: { i: number; q: number; r: number; s: number };
    move_type: MoveType;
    color: Color;
    piece: Piece;
  }) => {
    try {
      const validation = validateMove(moveData);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid move');
      }

      const moveNumber = await getNextMoveNumber(gameId);
      
      const move = new Move({
        gameId,
        moveNumber,
        from: moveData.from,
        to: moveData.to,
        move_type: moveData.move_type,
        color: moveData.color,
        piece: moveData.piece,
        timestamp: new Date()
      });

      await move.save();
      
      if (chessGame && validation.validMoves) {
        const wasmMove = validation.validMoves.find(validMove => 
          validMove.to.i === moveData.to.i &&
          validMove.to.q === moveData.to.q &&
          validMove.to.r === moveData.to.r &&
          validMove.to.s === moveData.to.s &&
          validMove.move_type === moveData.move_type
        );
        
        if (wasmMove) {
          chessGame.commitMove(wasmMove, null, true);
        } else {
          throw new Error('Could not find matching WASM move object');
        }
        
        const updatedFen = chessGame.getFen();
        await Game.findByIdAndUpdate(gameId, { fen: updatedFen });
        if (currentGame) {
          currentGame.fen = updatedFen;
        }

        syncTurnWithGameState();

        const gameState = chessGame.getGameState();
        if (gameState.won !== null && gameState.won !== undefined) {
          console.log('Game won by:', wasmColorToString(gameState.won));
          await Game.findByIdAndUpdate(gameId, { status: 'finished' });
          gameNamespace.emit("game-ended", { 
            winner: wasmColorToString(gameState.won),
            reason: 'checkmate'
          });
        } else if (gameState.is_stalemate) {
          console.log('Game ended in stalemate');
          await Game.findByIdAndUpdate(gameId, { status: 'finished' });
          gameNamespace.emit("game-ended", { 
            winner: null,
            reason: 'stalemate'
          });
        }
      }
      
      if (currentTurn) {
        const elapsedSeconds = getElapsedTime();
        updatePlayerTime(currentTurn, elapsedSeconds);
        
        lastMoveTime = new Date();
        
        gameNamespace.emit("turn-updated", { 
          currentTurn,
          playerTimes: Object.fromEntries(playerTimes),
          timeControl: currentGame?.timeControl
        });
      }
      
      return move;
    } catch (error) {
      console.error('Error saving move:', error);
      throw error;
    }
  };

  return () => {
    clearInterval(timeUpdateInterval);
  };
};


