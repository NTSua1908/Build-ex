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
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
require("dotenv").config();
const databaseUrl = process.env.DATABASE_URL;
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    if (databaseUrl)
        return mongoose_1.default
            .connect(databaseUrl)
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            yield seedData();
        }))
            .catch(() => {
            console.log("Can not connect to database");
        });
    else
        console.log("Can not find connection string");
});
exports.default = connectDatabase;
const seedData = () => __awaiter(void 0, void 0, void 0, function* () {
    const existedUsers = yield User_1.default.find();
    if (existedUsers.length == 0) {
        const email = process.env.EMAIL;
        const password = process.env.PASSWORD;
        const secondPassword = process.env.SECOND_PASSWORD;
        const thirdPassword = process.env.THIRD_PASSWORD;
        if (email && password && secondPassword && thirdPassword) {
            yield User_1.default.create({
                email: email,
                password: bcrypt_1.default.hashSync(password, 10),
                secondPassword: bcrypt_1.default.hashSync(secondPassword, 10),
                thirdPassword: bcrypt_1.default.hashSync(thirdPassword, 10),
            });
        }
        else {
            console.log("Can not seed data");
        }
    }
});
