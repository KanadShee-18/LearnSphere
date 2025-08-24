import { model, Schema, type Document, type Types } from "mongoose";

export interface IRatingAndReviews extends Document {
  user: Types.ObjectId;
  rating: number;
  review: string;
  course: Types.ObjectId;
}

const ratingAndReviewsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Course",
    index: true,
  },
});

export const RatingAndReviews = model<IRatingAndReviews>(
  "RatingAndReviews",
  ratingAndReviewsSchema
);
