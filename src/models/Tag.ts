import mongoose, { Document } from "mongoose";

export interface ITag extends Document {
  name: string;
}

const tagSchema = new mongoose.Schema<ITag>({
  name: { type: String, require: true },
});

export default mongoose.model<ITag>("Tag", tagSchema);
