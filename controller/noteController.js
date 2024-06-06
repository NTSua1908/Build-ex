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
const console_1 = require("console");
const enum_config_1 = require("../config/enum.config");
const common_helper_1 = require("../helper/common.helper");
const Note_1 = __importDefault(require("../models/Note"));
const Tag_1 = __importDefault(require("../models/Tag"));
const User_1 = __importDefault(require("../models/User"));
const common_helper_2 = require("./../helper/common.helper");
class NoteController {
    CreateNote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Process data
            const data = (0, common_helper_2.formatData)(req.body.content);
            (0, console_1.log)(data);
            const content = (0, common_helper_1.reverseString)((0, common_helper_1.shiftStringUpByOne)((0, common_helper_2.stringIn)(data || req.body.content)));
            const title = (0, common_helper_1.reverseString)((0, common_helper_1.shiftStringUpByOne)((0, common_helper_2.stringIn)(req.body.title)));
            const contents = (0, common_helper_1.createDataContent)(content);
            const titles = (0, common_helper_1.createDataTile)(title);
            // Process tags
            const nonExistedTags = yield findNonExistentTags(req.body.tags.map((tag) => tag.toLowerCase()));
            const newTags = yield Tag_1.default.insertMany(nonExistedTags.nonExistentTagNames.map((name) => ({ name })));
            const note = new Note_1.default({
                title1: titles[1],
                title2: titles[0],
                content1: contents[2],
                content2: contents[0],
                content3: contents[1],
                createdDate: new Date(),
                isDeleted: data !== undefined,
                shareable: false,
                tags: [
                    ...nonExistedTags.existingTagIds,
                    ...newTags.map((tag) => tag._id),
                ],
            });
            yield note.save();
            return res
                .status(201)
                .json({ id: note._id, isDeleted: data !== undefined });
        });
    }
    UpdateNote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            let note = yield Note_1.default.findById(id);
            if (!note) {
                return res.status(400).json({ message: "Note can not be found" });
            }
            // Process data
            const data = (0, common_helper_2.formatData)(req.body.content);
            const content = (0, common_helper_1.reverseString)((0, common_helper_1.shiftStringUpByOne)((0, common_helper_2.stringIn)(data || req.body.content)));
            const title = (0, common_helper_1.reverseString)((0, common_helper_1.shiftStringUpByOne)((0, common_helper_2.stringIn)(req.body.title)));
            const contents = (0, common_helper_1.createDataContent)(content);
            const titles = (0, common_helper_1.createDataTile)(title);
            // Process tags
            const nonExistedTags = yield findNonExistentTags(req.body.tags.map((tag) => tag.toLowerCase()));
            const newTags = yield Tag_1.default.insertMany(nonExistedTags.nonExistentTagNames.map((name) => ({ name })));
            const updateData = {
                title1: titles[1],
                title2: titles[0],
                content1: contents[2],
                content2: contents[0],
                content3: contents[1],
                isDeleted: data !== undefined,
                shareable: data !== undefined ? false : note.shareable,
                tags: [
                    ...nonExistedTags.existingTagIds,
                    ...newTags.map((tag) => tag._id),
                ],
                updatedDate: new Date(),
            };
            Object.assign(note, updateData);
            yield note.save();
            return res
                .status(200)
                .json({ id: note._id, isDeleted: data !== undefined });
        });
    }
    // ===> Get detail
    GetDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const note = yield Note_1.default.findById(id).populate("tags").exec();
            if (!note) {
                return res.status(400).json({ message: "Note can not be found" });
            }
            return yield getNoteDetail(note, req, res);
        });
    }
    // ===> Get all
    GetAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, createdDateFrom, createdDateTo, content, tags, orderType = enum_config_1.OrderType.Descending, page = 0, amount = 10, } = req.query;
            const tagsName = Array.isArray(tags) ? tags : tags ? [tags] : [];
            const isDeleted = (0, common_helper_1.checkIsDeleted)(title);
            let query = Note_1.default.find({ isDeleted: isDeleted }).populate("tags");
            console.log(title, createdDateFrom, createdDateTo, content, tagsName, orderType, page, amount);
            if (createdDateFrom) {
                query = query.find({ createdDate: { $gte: createdDateFrom } });
            }
            if (createdDateTo) {
                query = query.find({ createdDate: { $lte: createdDateTo } });
            }
            if (tagsName.length != 0) {
                const nonExistedTags = yield Tag_1.default.find({
                    name: {
                        $in: tagsName.map((tagName) => new RegExp(`^${tagName}$`, "i")),
                    },
                });
                const tagIds = nonExistedTags.map((tag) => tag._id);
                query = query.find({ tags: { $all: tagIds } });
            }
            var noteList;
            var totalCount = 0;
            let searchText = isDeleted ? title === null || title === void 0 ? void 0 : title.substring(10) : title;
            if (searchText || content) {
                var result = yield query.exec();
                noteList = parseToNoteList(result);
                if (searchText && searchText.length != 0) {
                    noteList = noteList.filter((note) => note.title.toLowerCase().indexOf(searchText.toLowerCase()) != -1);
                }
                if (content) {
                    noteList = noteList.filter((note) => note.content.toLowerCase().indexOf(content.toLowerCase()) != -1);
                }
                totalCount = noteList.length;
                if (orderType == enum_config_1.OrderType.Ascending) {
                    noteList = noteList.sort((a, b) => a.createdDate > b.createdDate ? 1 : -1);
                }
                else {
                    noteList = noteList.sort((a, b) => a.createdDate > b.createdDate ? -1 : 1);
                }
                noteList = noteList.slice(page * amount, (page + 1) * amount);
            }
            else {
                if (orderType == enum_config_1.OrderType.Ascending) {
                    query = query.sort({ createdDate: 1 });
                }
                else {
                    query = query.sort({ createdDate: -1 });
                }
                totalCount = yield Note_1.default.countDocuments(query);
                result = yield query
                    .skip(page * amount)
                    .limit(amount)
                    .exec();
                noteList = parseToNoteList(result);
            }
            const paginationResponse = {
                page,
                totalCount,
                data: noteList.map(({ id, title, tags, isDeleted, createdDate }) => ({
                    id,
                    title,
                    tags,
                    isDeleted,
                    createdDate,
                })),
            };
            return res.status(200).json(paginationResponse);
        });
    }
    ToggleShareable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const note = yield Note_1.default.findById(id);
            if (!note) {
                return res.status(400).json({ message: "Note can not be found" });
            }
            else if (note.isDeleted) {
                return res.status(400).json({ message: "Can not share this note!!!" });
            }
            yield Object.assign(note, {
                shareable: !note.shareable,
            });
            yield note.save();
            return res.status(200).json(note.shareable);
        });
    }
    // ===> Get detail
    GetNoteShareDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const note = yield Note_1.default.findById(id).populate("tags").exec();
            if (!note || !note.shareable || note.isDeleted) {
                return res.status(400).json({ message: "Note can not be found" });
            }
            return yield getNoteDetail(note, req, res);
        });
    }
    Delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const deletedNote = yield Note_1.default.findByIdAndDelete(id);
                if (!deletedNote) {
                    return res.status(404).json({ message: "Note not found" });
                }
                return res.status(200).json({ message: "Note successfully deleted" });
            }
            catch (error) {
                return res.status(500).json({ message: "Error deleting note" });
            }
        });
    }
}
exports.default = new NoteController();
const findNonExistentTags = (tagNames) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTags = yield Tag_1.default.find({
        name: { $in: tagNames.map((tagName) => new RegExp(`^${tagName}$`, "i")) },
    }).exec();
    const existingTagNames = existingTags.map((tag) => tag.name.toLowerCase());
    const nonExistentTagNames = tagNames.filter((tagName) => !existingTagNames.includes(tagName));
    const existingTagIds = existingTags.map((tag) => tag._id);
    return { nonExistentTagNames, existingTagIds };
});
const parseToNoteList = (result) => {
    const noteList = result.map((note) => {
        return {
            id: note._id,
            title: (0, common_helper_2.stringOut)((0, common_helper_2.shiftStringDownByOne)((0, common_helper_1.reverseString)(note.title2 + note.title1))),
            tags: note.tags.map((tag) => tag.name),
            createdDate: note.createdDate,
            isDeleted: note.isDeleted,
            content: (0, common_helper_2.stringOut)((0, common_helper_2.shiftStringDownByOne)((0, common_helper_1.reverseString)(note.content2 + note.content3 + note.content1))),
        };
    });
    return noteList;
};
const getNoteDetail = (note, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstPassword, secondPassword } = req.body;
    // Process note is deleted
    if (note.isDeleted) {
        if (!firstPassword || !secondPassword)
            return res.status(400).json({ message: "Note can not be found" });
        const user = yield User_1.default.findById(req.userId);
        if (user) {
            const isFirstPasswordCorrect = bcrypt_1.default.compareSync(firstPassword, user.secondPassword);
            const isSecondPasswordCorrect = bcrypt_1.default.compareSync(secondPassword, user.thirdPassword);
            if (!isFirstPasswordCorrect || !isSecondPasswordCorrect)
                return res.status(400).json({ message: "Incorrect password!!!" });
        }
    }
    const noteDetail = {
        id: note._id,
        title: (0, common_helper_2.stringOut)((0, common_helper_2.shiftStringDownByOne)((0, common_helper_1.reverseString)(note.title2 + note.title1))),
        content: (0, common_helper_2.stringOut)((0, common_helper_2.shiftStringDownByOne)((0, common_helper_1.reverseString)(note.content2 + note.content3 + note.content1))),
        tags: note.tags.map((tag) => tag.name),
        createdDate: note.createdDate,
        updatedDate: note.updatedDate,
        shareable: note.shareable,
        isDeleted: note.isDeleted,
    };
    return res.status(200).json(noteDetail);
});
