import express from "express";
import historyController from "../controllers/history";
import extractJWT from "../middleware/extractJWT";

const historyRouter = express.Router();

historyRouter.get("/games", extractJWT, historyController.getUserGames);

historyRouter.get("/games/:gameId/moves", extractJWT, historyController.getGameMoves);

export default historyRouter; 