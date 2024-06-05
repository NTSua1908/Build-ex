import express from "express";
import userController from "../controller/userController";
import verifyToken from "../middleware/auth";

const userRouter = express.Router();
userRouter.get("/info", verifyToken, userController.GetUserInfo);
userRouter.put("/update", verifyToken, userController.UpdateUser);

export default userRouter;
