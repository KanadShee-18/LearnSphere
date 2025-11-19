import { Schema, model, Types, Document } from "mongoose";
import type { ICourse } from "./course.model.js";

export interface ICategory extends Document {
  name: string;
  description: string;
  courses: Types.ObjectId[] | ICourse[];
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, "Course name is required!"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Course Description is required!"],
    trim: true,
  },
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

export const Category = model<ICategory>("Category", categorySchema);
