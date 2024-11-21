import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (token) {
    jwt.verify(token, config.server.token.secret, (error, decoded) => {
      if (error) {
        res.status(404).json({ message: error.message, error });
      } else {
        res.locals.jwt = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default extractJWT;
