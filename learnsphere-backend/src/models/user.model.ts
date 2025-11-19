import { model, Schema, type Document, type Types } from "mongoose";
import type { ICourseProgress } from "./courseProgress.model.js";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: "Admin" | "Student" | "Instructor";
  active: boolean;
  approved: boolean;
  additionalDetails: Types.ObjectId;
  courses: Types.ObjectId[];
  image: string;
  token?: string;
  resetPasswordExpires?: Date;
  courseProgress: Types.ObjectId[] | ICourseProgress[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["Admin", "Student", "Instructor"],
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    approved: {
      type: Boolean,
      default: true,
    },
    additionalDetails: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    image: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    courseProgress: [
      {
        type: Schema.Types.ObjectId,
        ref: "CourseProgress",
      },
    ],
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
