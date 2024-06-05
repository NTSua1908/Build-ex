import express from "express";
import authController from "../controller/authController";
const authRouter = express.Router();

authRouter.post("/login", authController.Login);
authRouter.post("/refreshToken", authController.RefreshToken);

export default authRouter;
