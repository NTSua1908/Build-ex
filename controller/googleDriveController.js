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
Object.defineProperty(exports, "__esModule", { value: true });
const google_helper_1 = require("../helper/google.helper");
const common_helper_1 = require("../helper/common.helper");
const stream_1 = require("stream");
class GoogleDriveController {
    UploadImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file) {
                    return res.status(400).json("No files were uploaded.");
                }
                const file = req.file;
                // Convert buffer to stream
                const fileStream = new stream_1.Readable();
                fileStream.push(file.buffer);
                fileStream.push(null); // Indicate end-of-file
                const driveResponse = yield google_helper_1.drive.files.create({
                    requestBody: {
                        name: (0, common_helper_1.createFileNameWithTimestamp)(file.originalname),
                        parents: ["1rO6OU9o4v-4qK-U71JaWB6CtQI5rtm-G"], // Folder ID
                    },
                    media: {
                        mimeType: file.mimetype,
                        body: fileStream,
                    },
                });
                const fileId = driveResponse.data.id;
                yield google_helper_1.drive.permissions.create({
                    fileId: fileId,
                    requestBody: {
                        role: "reader",
                        type: "anyone",
                    },
                });
                const fileLink = `https://drive.google.com/thumbnail?id=${fileId}&export=view&sz=w500`;
                return res.status(200).json({ link: fileLink });
            }
            catch (error) {
                console.error("Error uploading file to Google Drive:", error);
                return res.status(500).json("Internal Server Error");
            }
        });
    }
    DeleteImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ids = req.body.ids;
                if (ids.length != 0) {
                    const deletePromise = ids.map((id) => __awaiter(this, void 0, void 0, function* () {
                        yield google_helper_1.drive.files.delete({ fileId: id });
                    }));
                    yield Promise.all(deletePromise);
                }
                return res.sendStatus(200);
            }
            catch (error) {
                console.error("Error deleting file to Google Drive:", error);
                return res.sendStatus(400);
            }
        });
    }
}
exports.default = new GoogleDriveController();
