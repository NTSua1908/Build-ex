import express from "express";
import GoogleDriveController from "../controller/googleDriveController";
import uploadMiddleware from "../middleware/fileUpload";
import verifyToken from "../middleware/auth";

const googleDriverRouter = express.Router();

googleDriverRouter.post(
  "/UploadImage",
  [verifyToken, uploadMiddleware.single("file")],
  GoogleDriveController.UploadImage
);

googleDriverRouter.put(
  "/DeleteImages",
  verifyToken,
  GoogleDriveController.DeleteImage
);

export default googleDriverRouter;
