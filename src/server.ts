import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import startSocketServer from "./routes/sockets";
import initMongoose from "./models/db";
import bodyParser from "body-parser";
import authRouter from "./routes/auth";
import historyRouter from "./routes/history";
import { errorHandler } from "./middleware/errorHandler";

const app: Express = express();

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

async function main() {
  try {
    console.log('Starting server initialization...');
    
    console.log('Connecting to MongoDB...');
    const mongoose = await initMongoose();
    console.log('MongoDB connection established');

    app.use(cors({ origin: "*" }));
    app.use(bodyParser.json());
    
    const port = Number(process.env.PORT) || 3000;
    const host = '0.0.0.0';

    app.use("/api/auth", authRouter);
    app.use("/api/history", historyRouter);
    app.use(errorHandler);
    
    app.get("/", (req: Request, res: Response) => {
      res.send("Express + TypeScript Server");
    });

    app.get("/health", (req: Request, res: Response) => {
      res.status(200).send("OK");
    });

    const server = app.listen(port, host, () => {
      console.log(`[server]: Server is running at http://${host}:${port}`);

    });

    startSocketServer(server, mongoose);

    console.log('Server initialization complete');
  } catch (error) {
    console.error('Server initialization failed:', error);
    throw error;
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
});
