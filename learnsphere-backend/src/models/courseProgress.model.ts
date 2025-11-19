import { Document, Schema, Types, model } from "mongoose";

export interface ICourseProgress extends Document {
  courseID: Types.ObjectId;
  userId: Types.ObjectId;
  completedVideos: Types.ObjectId[];
}

const courseProgressSchema = new Schema<ICourseProgress>({
  courseID: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  completedVideos: [
    {
      type: Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
});

export const CourseProgress = model<ICourseProgress>(
  "CourseProgress",
  courseProgressSchema
);
