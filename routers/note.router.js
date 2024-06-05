"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const noteController_1 = __importDefault(require("../controller/noteController"));
const auth_1 = __importDefault(require("../middleware/auth"));
const noteRouter = express_1.default.Router();
noteRouter.post("/create", auth_1.default, noteController_1.default.CreateNote);
noteRouter.put("/update/:id", auth_1.default, noteController_1.default.UpdateNote);
noteRouter.get("/getAll", auth_1.default, noteController_1.default.GetAll);
noteRouter.post("/:id", auth_1.default, noteController_1.default.GetDetail);
noteRouter.post("/share/:id", noteController_1.default.GetNoteShareDetail);
noteRouter.put("/toggleShareable/:id", auth_1.default, noteController_1.default.ToggleShareable);
noteRouter.delete("/delete/:id", auth_1.default, noteController_1.default.Delete);
exports.default = noteRouter;
