import express from "express";
import verifyToken from "../middleware/auth";
import tagController from "../controller/tagController";

const tagRouter = express.Router();
tagRouter.get("/search", verifyToken, tagController.GetTag);

export default tagRouter;
