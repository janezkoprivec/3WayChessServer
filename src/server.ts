import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import startSocketServer from "./routes/sockets";
import initMongoose from "./models/db";
import bodyParser from "body-parser";
import authRouter from "./routes/auth";
import { errorHandler } from "./middleware/errorHandler";

const app: Express = express();

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Keep the process alive but log the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Keep the process alive but log the error
});

async function main() {
  try {
    console.log('Starting server initialization...');
    
    // Initialize MongoDB connection
    console.log('Connecting to MongoDB...');
    const mongoose = await initMongoose();
    console.log('MongoDB connection established');

    // Middleware
    app.use(cors({ origin: "*" }));
    app.use(bodyParser.json());
    
    const port = process.env.PORT || 3000;

    // Routes
    app.use("/auth", authRouter);
    app.use(errorHandler);
    
    app.get("/", (req: Request, res: Response) => {
      res.send("Express + TypeScript Server");
    });

    app.get("/health", (req: Request, res: Response) => {
      res.status(200).send("OK");
    });

    // Start server
    const server = app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });

    // Initialize socket server
    startSocketServer(server, mongoose);

    console.log('Server initialization complete');
  } catch (error) {
    console.error('Server initialization failed:', error);
    // Don't exit, just log the error
    throw error;
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  // Don't exit, just log the error
});
