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
const Tag_1 = __importDefault(require("../models/Tag"));
class TagController {
    GetTag(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchText, page = 0, amount = 10 } = req.query;
            let query = Tag_1.default.find();
            if (searchText && searchText.length != 0)
                query = query.find({ name: new RegExp(searchText, "i") });
            const tags = yield query
                .skip(page * amount)
                .limit(amount)
                .exec();
            return res.status(200).json(tags.map((tag) => ({ value: tag.name })));
        });
    }
}
exports.default = new TagController();
