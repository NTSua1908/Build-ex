import jwt from "jsonwebtoken";
import mongoose, { mongo } from "mongoose";
import { IUser } from "../models/User";

export const generateToken = (user: IUser) => {
  const accessToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "60m",
    }
  );

  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.ACCESS_TOKEN_REFRESH!,
    { expiresIn: "60d" }
  );

  return {
    accessToken,
    refreshToken,
  };
};
