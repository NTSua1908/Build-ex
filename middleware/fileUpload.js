"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const multer_1 = __importDefault(require("multer"));
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];
const uploadMiddleware = (0, multer_1.default)({
    limits: {
        fileSize: 1024 * 1024, // 5MB
    },
    storage: multer_1.default.memoryStorage(),
    fileFilter(req, file, cb) {
        if (!imageMimeTypes.includes(file.mimetype)) {
            return cb(new Error("Only image files are allowed"), false);
        }
        if (file.size > 1024 * 1024) {
            return cb(new Error("File size exceeds the limit of 5MB"), false);
        }
        cb(null, true);
    },
});
module.exports = uploadMiddleware;
