import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import startSocketServer from "./routes/sockets";
import initMongoose from "./models/db";
import config from "./config/config";
import mongoose, { ConnectOptions } from "mongoose";
import bodyParser from "body-parser";
import authRouter from "./routes/auth";

async function main() {
  // Load environment variables first
  dotenv.config();

  // Then initialize database

  const mongoose = await initMongoose();


  // require("./models/db-models");

  // mongoose.connect(config.mongo.url); 

  const app: Express = express();
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(bodyParser.json());
  const port = process.env.PORT || 3000;

  const server = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });

  app.use("/auth", authRouter);

  startSocketServer(server, mongoose);

  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
  });
}

main();
