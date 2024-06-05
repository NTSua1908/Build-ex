import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  secondPassword: string;
  thirdPassword: string;
  refreshToken?: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, require: true, minLength: 5 },
  password: { type: String, require: true, minLength: 6 },
  secondPassword: { type: String, require: true, minLength: 6 },
  thirdPassword: { type: String, require: true, minLength: 6 },
  refreshToken: String,
});

export default mongoose.model<IUser>("User", userSchema);
