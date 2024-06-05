"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    var accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!token || !accessTokenSecret)
        return res.sendStatus(401);
    try {
        const decode = jsonwebtoken_1.default.verify(token, accessTokenSecret);
        req.userId = decode.id;
        next();
    }
    catch (error) {
        res.sendStatus(403);
    }
};
exports.default = verifyToken;
