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
const User_1 = __importDefault(require("../models/User"));
class UserController {
    GetUserInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.userId;
            const user = yield User_1.default.findById(id);
            if (!user) {
                return res.status(400).json({ message: "User can not be found" });
            }
            const userInfo = {
                email: user.email,
            };
            return res.status(200).json(userInfo);
        });
    }
    UpdateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.userId;
            const user = yield User_1.default.findById(id);
            console.log(id);
            if (!user) {
                return res.status(400).json({ message: "User can not be found" });
            }
            const userInfo = req.body;
            const errors = validateUpdate(userInfo);
            if (errors.length != 0) {
                return res.status(400).json({
                    message: errors.join("\n"),
                });
            }
            try {
                if (userInfo.oneNewPassword.length != 0) {
                    const isCorrect = bcrypt_1.default.compareSync(userInfo.oneOldPassword, user.password);
                    console.log(isCorrect, userInfo.oneOldPassword);
                    if (isCorrect)
                        user.password = bcrypt_1.default.hashSync(userInfo.oneNewPassword, 10);
                    else
                        return res.status(400).json({ message: "Password is incorrect" });
                }
                if (userInfo.secondNewPassword.length != 0) {
                    const isCorrect = bcrypt_1.default.compareSync(userInfo.secondNewPassword, user.secondPassword);
                    if (isCorrect)
                        user.secondPassword = bcrypt_1.default.hashSync(userInfo.secondNewPassword, 10);
                    else
                        return res.status(400).json({ message: "Password is incorrect" });
                }
                if (userInfo.thirdNewPassword.length != 0) {
                    const isCorrect = bcrypt_1.default.compareSync(userInfo.thirdNewPassword, user.thirdPassword);
                    if (isCorrect)
                        user.thirdPassword = bcrypt_1.default.hashSync(userInfo.thirdNewPassword, 10);
                    else
                        return res.status(400).json({ message: "Password is incorrect" });
                }
                yield user.save();
                return res.status(200).json();
            }
            catch (_a) {
                return res.status(400).json({ message: "Password incorrect!!!" });
            }
        });
    }
}
exports.default = new UserController();
const validateUpdate = (userInfo) => {
    let errors1 = validatePassword(userInfo.oneOldPassword, userInfo.oneNewPassword, userInfo.oneConfirmPassword);
    let errors2 = validatePassword(userInfo.secondOldPassword, userInfo.secondNewPassword, userInfo.secondConfirmPassword);
    let errors3 = validatePassword(userInfo.thirdOldPassword, userInfo.thirdNewPassword, userInfo.thirdConfirmPassword);
    const errors = [
        errors1.length != 0 ? "Mật khẩu cấp 1: " + errors1.join("; ") : "",
        errors2.length != 0 ? "Mật khẩu cấp 2: " + errors2.join("; ") : "",
        errors3.length != 0 ? "Mật khẩu cấp 3: " + errors3.join("; ") : "",
    ].filter((error) => error.length != 0);
    return errors;
};
const validatePassword = (oneOldPassword, oneNewPassword, oneConfirmPassword) => {
    let errors = [];
    if (oneNewPassword.length != 0 || oneConfirmPassword.length != 0) {
        if (oneOldPassword.length == 0) {
            errors.push("mật khẩu cũ là bắt buộc");
        }
        if (oneConfirmPassword != oneNewPassword) {
            errors.push("nhập lại mật khẩu không khớp");
        }
        if (oneNewPassword.length < 6) {
            errors.push("mật khẩu cần ít nhất có 6 kí tự");
        }
    }
    return errors;
};
