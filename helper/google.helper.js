"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drive = void 0;
const path_1 = __importDefault(require("path"));
const googleapis_1 = require("googleapis");
const KEYFILEPATH = path_1.default.join("/etc/secrets/", "experience-424602-df66ebfd0638.json");
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});
exports.drive = googleapis_1.google.drive({ version: "v3", auth });
