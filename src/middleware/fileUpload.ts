import multer from "multer";
import * as fs from "fs";
import * as path from "path";

const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

const uploadMiddleware = multer({
  limits: {
    fileSize: 1024 * 1024, // 5MB
  },
  storage: multer.memoryStorage(),
  fileFilter(
    req: Express.Request,
    file: Express.Multer.File,
    cb: (err: any, acceptFile: boolean) => void
  ) {
    if (!imageMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only image files are allowed"), false);
    }
    if (file.size > 1024 * 1024) {
      return cb(new Error("File size exceeds the limit of 5MB"), false);
    }
    cb(null, true);
  },
});

export = uploadMiddleware;
