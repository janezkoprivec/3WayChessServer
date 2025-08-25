import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/db-models";
import mongoose from "mongoose";
import signJWT from "../functions/signJWT";

const validateToken = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Authorized" });
};

const register = async (req: Request, res: Response) => {
  try {
    let { email, username, password } = req.body;

    try {
      const hash = await bcrypt.hash(password, 10);
      const user = new User({ email, username, password: hash });
      
      try {
        const savedUser = await user.save();
        res.status(201).json({ message: "User registered", user: savedUser });
      } catch (error: any) {
        if (error.code === 11000) {
          res.status(409).json({ message: "User already exists" });
        } else {
          console.error(error);
          res.status(500).json({ message: error.message });
        }
      }
    } catch (hashError) {
      res.status(500).json({ message: "Error hashing password" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req: Request, res: Response) => {
  let { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      bcrypt.compare(password, user.password, (err: any, result: boolean) => {
        if (!result) {
          res.status(401).json({ message: "Unauthorized" });
        } else if (err) {
          res.status(401).json({ message: "Unauthorized" });
        } else if (result) {
          signJWT(user, (error: Error | null, token: string | null) => {
            if (error) {
              res.status(401).json({ message: "Unauthorized", error });
            } else if (token) {
              res
                .status(200)
                .json({
                  message: "Authorized",
                  token,
                  user: { _id: user._id, username: user.username },
                });
            }
          });
        } else {
          res.status(401).json({ message: "Unauthorized" });
        }
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: error.message, error });
    });
};

const getAllUsers = async (req: Request, res: Response) => {
  User.find()
    .select("-password")
    .exec()
    .then((users) => {
      return res.status(200).json({ users, count: users.length });
    })
    .catch((error) => {
      return res.status(500).json({ message: error.message, error });
    });
};

const getMe = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.jwt.userId;
    
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    
    res.status(200).json({ user });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message, error });
  }
};

const updateProfilePicture = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.jwt.userId;
    const { profilePictureUrl } = req.body;
    
    if (!profilePictureUrl) {
      res.status(400).json({ message: "Profile picture URL is required" });
      return;
    }
    
    try {
      new URL(profilePictureUrl);
    } catch (error) {
      res.status(400).json({ message: "Invalid URL format" });
      return;
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePictureUrl },
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    
    res.status(200).json({ 
      message: "Profile picture updated successfully", 
      user 
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message, error });
  }
};

export default {
  validateToken,
  register,
  login,
  getAllUsers,
  getMe,
  updateProfilePicture,
};
