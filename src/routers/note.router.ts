import express from "express";
import noteController from "../controller/noteController";
import verifyToken from "../middleware/auth";

const noteRouter = express.Router();
noteRouter.post("/create", verifyToken, noteController.CreateNote);
noteRouter.put("/update/:id", verifyToken, noteController.UpdateNote);
noteRouter.get("/getAll", verifyToken, noteController.GetAll);
noteRouter.post("/:id", verifyToken, noteController.GetDetail);
noteRouter.post("/share/:id", noteController.GetNoteShareDetail);
noteRouter.put(
  "/toggleShareable/:id",
  verifyToken,
  noteController.ToggleShareable
);
noteRouter.delete("/delete/:id", verifyToken, noteController.Delete);

export default noteRouter;
