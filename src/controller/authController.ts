import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../helper/auth.helper";
import { JSONBodyRequest } from "../request";

class AuthController {
  async Login(
    req: Request<{ email: string; password: string }>,
    res: Response
  ) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        const isCorrectPassword = bcrypt.compareSync(password, user.password!);
        if (isCorrectPassword) {
          const token = generateToken(user);
          user.refreshToken = token.refreshToken;
          await user.save();

          return res.status(200).json({ token });
        }
      }
    } catch (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(400).json({ message: "Email or password incorrect" });
  }

  async RefreshToken(
    req: JSONBodyRequest<{ refreshToken: string }>,
    res: Response
  ) {
    const refreshToken = req.body.refreshToken;
    const ACCESS_TOKEN_REFRESH = process.env.ACCESS_TOKEN_REFRESH;
    if (refreshToken && ACCESS_TOKEN_REFRESH) {
      try {
        const user = await User.findOne({ refreshToken });
        if (!user) return res.sendStatus(403);

        jwt.verify(refreshToken, ACCESS_TOKEN_REFRESH);
        const token = await generateToken(user);

        user.refreshToken = token.refreshToken;
        await user.save();

        return res.status(200).json({ token });
      } catch (error) {
        return res.sendStatus(403);
      }
    }
    return res.sendStatus(401);
  }
}

export default new AuthController();
