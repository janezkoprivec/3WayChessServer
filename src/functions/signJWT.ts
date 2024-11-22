import jwt from "jsonwebtoken";
import config from "../config/config";
import { IUser } from "../models/db-models";

const signJWT = (
  user: IUser,
  callback: (error: Error | null, token: string | null) => void
): void => {
  let timeSinceEpoch = new Date().getTime();
  let expirationTime =
    timeSinceEpoch + Number(config.server.token.expireTime) * 100000;
  let expirationTimeInSeconds = Math.floor(expirationTime / 1000);

  try {
    jwt.sign(
      {
        username: user.username,
      },
      config.server.token.secret,
      {
        issuer: config.server.token.issuer,
        algorithm: "HS256",
        expiresIn: expirationTimeInSeconds,
      },
      (error, token) => {
        if (error) {
          callback(error, null);
        } else if (token) {
          callback(null, token);
        }
      }
    );
  } catch (error) {
    callback(error as Error, null);
  }
};

export default signJWT;
