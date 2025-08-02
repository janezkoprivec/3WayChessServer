import express from "express";
import userController from "../controllers/user";
import extractJWT from "../middleware/extractJWT";

const authRouter = express.Router();

authRouter.get("/validate", extractJWT, userController.validateToken);
authRouter.post("/register", userController.register);
authRouter.post("/login", userController.login);
authRouter.get("/all", userController.getAllUsers);
authRouter.get("/me", extractJWT, userController.getMe);

export default authRouter;
