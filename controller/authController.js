"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const auth_helper_1 = require("../helper/auth.helper");
class AuthController {
    Login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const user = yield User_1.default.findOne({ email });
                if (user) {
                    const isCorrectPassword = bcrypt_1.default.compareSync(password, user.password);
                    if (isCorrectPassword) {
                        const token = (0, auth_helper_1.generateToken)(user);
                        user.refreshToken = token.refreshToken;
                        yield user.save();
                        return res.status(200).json({ token });
                    }
                }
            }
            catch (error) {
                return res.status(500).json({ message: error });
            }
            return res.status(400).json({ message: "Email or password incorrect" });
        });
    }
    RefreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.body.refreshToken;
            const ACCESS_TOKEN_REFRESH = process.env.ACCESS_TOKEN_REFRESH;
            if (refreshToken && ACCESS_TOKEN_REFRESH) {
                try {
                    const user = yield User_1.default.findOne({ refreshToken });
                    if (!user)
                        return res.sendStatus(403);
                    jsonwebtoken_1.default.verify(refreshToken, ACCESS_TOKEN_REFRESH);
                    const token = yield (0, auth_helper_1.generateToken)(user);
                    user.refreshToken = token.refreshToken;
                    yield user.save();
                    return res.status(200).json({ token });
                }
                catch (error) {
                    return res.sendStatus(403);
                }
            }
            return res.sendStatus(401);
        });
    }
}
exports.default = new AuthController();
