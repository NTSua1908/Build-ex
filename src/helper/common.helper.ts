export function getCurrentTimeString() {
  const currentDate = new Date();
  const dateString = currentDate
    .toISOString()
    .replace(/[-:]/g, "")
    .split(".")[0];
  return dateString;
}

export function createFileNameWithTimestamp(originalFileName: string) {
  const timestamp = getCurrentTimeString();
  const extension = originalFileName.split(".").pop();
  const fileName = `${originalFileName.replace(
    `.${extension}`,
    ""
  )}_${timestamp}.${extension}`;
  return fileName;
}

export const checkIsDeleted = (str?: string) => {
  return str?.startsWith("==deleted:") ?? false;
};

export const stringIn = (str: string) => {
  return Buffer.from(str).toString("hex");
};

export const stringOut = (str: string) => {
  return Buffer.from(str, "hex").toString("utf-8");
};

export const reverseString = (str: string) => {
  return str.split("").reverse().join("");
};

export const formatData = (str: string) => {
  const isDeleted = str.startsWith("==deleted\n\n");
  if (isDeleted) {
    return str.substring(11);
  }
};

export const shiftStringUpByOne = (str: string) => {
  return str
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) + 1))
    .join("");
};

export const shiftStringDownByOne = (str: string) => {
  return str
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) - 1))
    .join("");
};

export const createDataContent = (str: string) => {
  const len = str.length;
  const partLength = Math.ceil(len / 3);

  const part1 = str.slice(0, partLength);
  const part2 = str.slice(partLength, 2 * partLength);
  const part3 = str.slice(2 * partLength);

  return [part1, part2, part3];
};

export const createDataTile = (str: string) => {
  const len = str.length;
  const partLength = Math.ceil(len / 2);

  const part1 = str.slice(0, partLength);
  const part2 = str.slice(partLength);

  return [part1, part2];
};

export const getDateTimeInTimeZone = (timezoneOffset: number) => {
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
