import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/db-models";
import mongoose from "mongoose";
import signJWT from "../functions/signJWT";

const validateToken = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Authorized" });
};

const register = async (req: Request, res: Response) => {
  let { email, username, password } = req.body;

  bcrypt.hash(password, 10, (err: any, hash: string) => {
    if (err) {
      res.status(500).json({ message: err.message, error: err });
    }

    const user = new User({ email, username, password: hash });
    return user.save().then((user) => {
      res.status(201).json({ message: "User registered", user });
    }).catch((error) => {
      if (error.code === 11000) {
        res.status(409).json({ message: "User already exists" });
      } else {
        res.status(500).json({ message: error.message });
      }
    });
  });
};

const login = async (req: Request, res: Response) => {
  let { username, password } = req.body;

  User.findOne({ username }).then((user) => {
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    bcrypt.compare(password, user.password, (err: any, result: boolean) => {
      if (!result){
        res.status(401).json({ message: "Unauthorized" });
      } else if (err) {
        res.status(401).json({ message: "Unauthorized" });
      } else if (result) {
        signJWT(user, (error: Error |  null, token: string | null) => {
          if (error) {
            res.status(401).json({ message: "Unauthorized", error });
          } else if (token) {
            res.status(200).json({ message: "Authorized", token, user: { _id: user._id, username: user.username } });
          }
        });
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    });
  }).catch((error) => {
    res.status(500).json({ message: error.message, error });
  });
};

const getAllUsers = async (req: Request, res: Response) => {
  User.find().select("-password").exec().then((users) => {
    return res.status(200).json({ users, count: users.length });
  }).catch((error) => {
    return res.status(500).json({ message: error.message, error });
  });
};

export default {
  validateToken,
  register,
  login,
  getAllUsers,
};
