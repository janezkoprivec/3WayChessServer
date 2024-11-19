import socketIO from "socket.io";
import { Server } from "http";
import { Game } from "../models/db-models";
import { Mongoose } from "mongoose";

const startSocketServer = (server: Server, mongoose: Mongoose) => {
  const io = new socketIO.Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  
  io.on("connection", (socket) => {
    console.log("a user connected");
  });

  const gamesNamespace = io.of('/games');
  
  gamesNamespace.on("connection", async (socket) => {
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB not connected');
      socket.emit('error', 'Database connection error');
      return;
    } 

    try {
      const games = await Game.find({ status: 'waiting' })
        .populate({
          path: 'players',
          populate: {
            path: 'user',
          }
        });

      socket.emit('waiting-games', games);
    } catch (err) {
      console.error('Error fetching games:', err);
      socket.emit('error', 'Failed to fetch games');
    }
  }); 

}

export default startSocketServer;