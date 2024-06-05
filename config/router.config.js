"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleDrive_router_1 = __importDefault(require("../routers/googleDrive.router"));
const auth_router_1 = __importDefault(require("../routers/auth.router"));
const note_router_1 = __importDefault(require("../routers/note.router"));
const user_router_1 = __importDefault(require("../routers/user.router"));
const tag_router_1 = __importDefault(require("../routers/tag.router"));
const configRoutes = (app) => {
    app.use("/api/auth/", auth_router_1.default);
    app.use("/api/note/", googleDrive_router_1.default);
    app.use("/api/note/", note_router_1.default);
    app.use("/api/user/", user_router_1.default);
    app.use("/api/tag/", tag_router_1.default);
    app.use((err, req, res, next) => {
        if (err.code === "LIMIT_FILE_SIZE") {
            res.status(413).send({ message: "File size exceeds the limit of 5MB" });
        }
        else if (err.message) {
            return res.status(400).json({ errors: err.message });
        }
        else {
            next(err);
        }
    });
};
exports.default = configRoutes;
