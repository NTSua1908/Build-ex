import mongoose, { Document } from "mongoose";
import { ITag } from "./Tag";

export interface INote extends Document {
  title1: string;
  title2: string;
  content1: string;
  content2: string;
  content3: string;
  createdDate: Date;
  updatedDate?: Date;
  isDeleted: boolean;
  shareable: boolean;
  tags: ITag[];
}

const noteSchema = new mongoose.Schema<INote>({
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
});

export default mongoose.model<INote>("Note", noteSchema);
