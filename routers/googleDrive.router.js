"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const googleDriveController_1 = __importDefault(require("../controller/googleDriveController"));
const fileUpload_1 = __importDefault(require("../middleware/fileUpload"));
const auth_1 = __importDefault(require("../middleware/auth"));
const googleDriverRouter = express_1.default.Router();
googleDriverRouter.post("/UploadImage", [auth_1.default, fileUpload_1.default.single("file")], googleDriveController_1.default.UploadImage);
googleDriverRouter.put("/DeleteImages", auth_1.default, googleDriveController_1.default.DeleteImage);
exports.default = googleDriverRouter;
