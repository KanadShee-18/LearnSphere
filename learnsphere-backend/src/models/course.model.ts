import { Schema, model, Document, Types } from "mongoose";
import type { ISection } from "./section.model.js";

export interface ICourse extends Document {
  courseName: string;
  courseDescription: string;
  instructor: Types.ObjectId;
  whatYouWillLearn: string;
  courseContent: Types.ObjectId[] | ISection[];
  ratingAndReviews: Types.ObjectId[];
  price?: number;
  thumbnail?: string;
  tag: string[];
  category?: Types.ObjectId;
  studentsEnrolled: Types.ObjectId[];
  instructions?: string[];
  status?: "Draft" | "Published";
  createdAt: Date;
}

const courseSchema = new Schema<ICourse>({
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  courseDescription: {
    type: String,
    required: true,
    trim: true,
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  whatYouWillLearn: {
    type: String,
    required: true,
  },
  courseContent: [
    {
      type: Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  ratingAndReviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "RatingAndReviews",
    },
  ],
  price: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  tag: {
    type: [String],
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  studentsEnrolled: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
  instructions: {
    type: [String],
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Course = model<ICourse>("Course", courseSchema);
