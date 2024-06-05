import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  var accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!token || !accessTokenSecret) return res.sendStatus(401);

  try {
    const decode = jwt.verify(token, accessTokenSecret);
    (req as any).userId = (decode as any).id;
    next();
  } catch (error) {
    res.sendStatus(403);
  }
};

export default verifyToken;
