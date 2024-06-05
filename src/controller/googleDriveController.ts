import { UploadedFile } from "express-fileupload";
import { drive } from "../helper/google.helper";
import { Request, Response } from "express";
import { createFileNameWithTimestamp } from "../helper/common.helper";
import { Readable } from "stream";
import { JSONBodyRequest } from "../request";
import { log } from "console";

class GoogleDriveController {
  async UploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json("No files were uploaded.");
      }
      const file: Express.Multer.File = req.file;
      // Convert buffer to stream
      const fileStream = new Readable();
      fileStream.push(file.buffer);
      fileStream.push(null); // Indicate end-of-file

      const driveResponse = await drive.files.create({
        requestBody: {
          name: createFileNameWithTimestamp(file.originalname),
          parents: ["1rO6OU9o4v-4qK-U71JaWB6CtQI5rtm-G"], // Folder ID
        },
        media: {
          mimeType: file.mimetype,
          body: fileStream,
        },
      });

      const fileId = driveResponse.data.id;

      await drive.permissions.create({
        fileId: fileId!,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      const fileLink = `https://drive.google.com/thumbnail?id=${fileId}&export=view&sz=w500`;
      return res.status(200).json({ link: fileLink });
    } catch (error) {
      console.error("Error uploading file to Google Drive:", error);
      return res.status(500).json("Internal Server Error");
    }
  }

  async DeleteImage(req: JSONBodyRequest<{ ids: string[] }>, res: Response) {
    try {
      const ids = req.body.ids;
      if (ids.length != 0) {
        const deletePromise = ids.map(async (id) => {
          await drive.files.delete({ fileId: id });
        });
        await Promise.all(deletePromise);
      }

      return res.sendStatus(200);
    } catch (error) {
      console.error("Error deleting file to Google Drive:", error);
      return res.sendStatus(400);
    }
  }
}

export default new GoogleDriveController();
