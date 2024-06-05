"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const noteSchema = new mongoose_1.default.Schema({
    title1: { type: String, require: true },
    title2: { type: String, require: true },
    content1: { type: String, require: true },
    content2: { type: String, require: true },
    content3: { type: String, require: true },
    createdDate: { type: Date, require: true },
    updatedDate: { type: Date, require: false },
    isDeleted: { type: Boolean },
    shareable: { type: Boolean },
    tags: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Tag",
        },
    ],
});
exports.default = mongoose_1.default.model("Note", noteSchema);
