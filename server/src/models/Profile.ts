import { model, Schema, type Document } from "mongoose";

export interface IProfile extends Document {
  displayName: string;
  gender: string;
  dateOfBirth: string;
  about: string;
  profession: string;
  contactNumber: number;
}

const profileSchema = new Schema<IProfile>({
  displayName: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  about: {
    type: String,
    trim: true,
  },
  profession: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: Number,
    trim: true,
  },
});

export const Profile = model<IProfile>("Profile", profileSchema);
