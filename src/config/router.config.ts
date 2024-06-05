import express from "express";
import googleDriverRouter from "../routers/googleDrive.router";
import authRouter from "../routers/auth.router";
import noteRouter from "../routers/note.router";
import userRouter from "../routers/user.router";
import tagRouter from "../routers/tag.router";

const configRoutes = (app: express.Application) => {
  app.use("/api/auth/", authRouter);
  app.use("/api/note/", googleDriverRouter);
  app.use("/api/note/", noteRouter);
  app.use("/api/user/", userRouter);
  app.use("/api/tag/", tagRouter);

  app.use(
    (err: any, req: express.Request, res: express.Response, next: any) => {
      if (err.code === "LIMIT_FILE_SIZE") {
        res.status(413).send({ message: "File size exceeds the limit of 5MB" });
      } else if (err.message) {
        return res.status(400).json({ errors: err.message });
      } else {
        next(err);
      }
    }
  );
};

export default configRoutes;
