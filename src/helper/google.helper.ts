import path from "path";
import { google } from "googleapis";

const KEYFILEPATH = path.join(
  __dirname,
  "../experience-424602-df66ebfd0638.json"
);
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

export const drive = google.drive({ version: "v3", auth });
