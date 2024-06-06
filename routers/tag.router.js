"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const tagController_1 = __importDefault(require("../controller/tagController"));
const tagRouter = express_1.default.Router();
tagRouter.get("/search", auth_1.default, tagController_1.default.GetTag);
exports.default = tagRouter;
