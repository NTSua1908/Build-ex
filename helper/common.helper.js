"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateTimeInTimeZone = exports.createDataTile = exports.createDataContent = exports.shiftStringDownByOne = exports.shiftStringUpByOne = exports.formatData = exports.reverseString = exports.stringOut = exports.stringIn = exports.checkIsDeleted = exports.createFileNameWithTimestamp = exports.getCurrentTimeString = void 0;
function getCurrentTimeString() {
    const currentDate = new Date();
    const dateString = currentDate
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0];
    return dateString;
}
exports.getCurrentTimeString = getCurrentTimeString;
function createFileNameWithTimestamp(originalFileName) {
    const timestamp = getCurrentTimeString();
    const extension = originalFileName.split(".").pop();
    const fileName = `${originalFileName.replace(`.${extension}`, "")}_${timestamp}.${extension}`;
    return fileName;
}
exports.createFileNameWithTimestamp = createFileNameWithTimestamp;
const checkIsDeleted = (str) => {
    var _a;
    return (_a = str === null || str === void 0 ? void 0 : str.startsWith("==deleted:")) !== null && _a !== void 0 ? _a : false;
};
exports.checkIsDeleted = checkIsDeleted;
const stringIn = (str) => {
    return Buffer.from(str).toString("hex");
};
exports.stringIn = stringIn;
const stringOut = (str) => {
    return Buffer.from(str, "hex").toString("utf-8");
};
exports.stringOut = stringOut;
const reverseString = (str) => {
    return str.split("").reverse().join("");
};
exports.reverseString = reverseString;
const formatData = (str) => {
    const isDeleted = str.startsWith("==deleted\n\n");
    if (isDeleted) {
        return str.substring(11);
    }
};
exports.formatData = formatData;
const shiftStringUpByOne = (str) => {
    return str
        .split("")
        .map((char) => String.fromCharCode(char.charCodeAt(0) + 1))
        .join("");
};
exports.shiftStringUpByOne = shiftStringUpByOne;
const shiftStringDownByOne = (str) => {
    return str
        .split("")
        .map((char) => String.fromCharCode(char.charCodeAt(0) - 1))
        .join("");
};
exports.shiftStringDownByOne = shiftStringDownByOne;
const createDataContent = (str) => {
    const len = str.length;
    const partLength = Math.ceil(len / 3);
    const part1 = str.slice(0, partLength);
    const part2 = str.slice(partLength, 2 * partLength);
    const part3 = str.slice(2 * partLength);
    return [part1, part2, part3];
};
exports.createDataContent = createDataContent;
const createDataTile = (str) => {
    const len = str.length;
    const partLength = Math.ceil(len / 2);
    const part1 = str.slice(0, partLength);
    const part2 = str.slice(partLength);
    return [part1, part2];
};
exports.createDataTile = createDataTile;
const getDateTimeInTimeZone = (timezoneOffset) => {
    const now = new Date();
    const utcOffset = now.getTimezoneOffset() * 60; // convert minutes to seconds
    const timezoneOffsetMs = timezoneOffset * 60 * 1000; // convert hours to milliseconds
    const timezoneOffsetSeconds = timezoneOffsetMs / 1000; // convert milliseconds to seconds
    const utcTime = now.getTime() + utcOffset + timezoneOffsetSeconds;
    const date = new Date(utcTime);
    date.setHours(date.getHours() + Math.floor(timezoneOffset / 60));
    date.setMinutes(date.getMinutes() + Math.floor(timezoneOffset % 60));
    return date;
};
exports.getDateTimeInTimeZone = getDateTimeInTimeZone;
