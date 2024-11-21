import socketIO from "socket.io";
import { Server } from "http";
import { Game } from "../models/db-models";
import { Mongoose } from "mongoose";
import gamesController from "../controllers/games";

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


  gamesController(io);
}

export default startSocketServer;