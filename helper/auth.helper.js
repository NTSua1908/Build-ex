"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (user) => {
    const accessToken = jsonwebtoken_1.default.sign({
        id: user._id,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "60m",
    });
    const refreshToken = jsonwebtoken_1.default.sign({
        id: user._id,
    }, process.env.ACCESS_TOKEN_REFRESH, { expiresIn: "60d" });
    return {
        accessToken,
        refreshToken,
    };
};
exports.generateToken = generateToken;
