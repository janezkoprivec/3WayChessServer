import express, { Express, Request, Response } from "express";
import socketIO from "socket.io";
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config();

const app: Express = express();
app.use(cors());
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

const io = new socketIO.Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

io.on("connection", (socket) => {
  console.log("a user connected");
});