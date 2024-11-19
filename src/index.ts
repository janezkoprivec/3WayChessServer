import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import startSocketServer from "./routes/sockets";
import initMongoose from "./models/db";

async function main() {
  // Load environment variables first
  dotenv.config();

  // Then initialize database

  const mongoose = await initMongoose();
  require("./models/db-models");

  const app: Express = express();
  app.use(
    cors({
      origin: "*",
    })
  );
  const port = process.env.PORT || 3000;

  const server = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });

  startSocketServer(server, mongoose);

  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
  });
}

main();
