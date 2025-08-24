import { model, Schema, type Document, type Types } from "mongoose";
import type { ISubSection } from "./SubSection.js";

export interface ISection extends Document {
  sectionName: string;
  subSection: Types.ObjectId[] | ISubSection[];
}

const sectionSchema = new Schema<ISection>({
  sectionName: {
    type: String,
  },
  subSection: [
    {
      type: Schema.Types.ObjectId,
      ref: "SubSection",
      required: true,
    },
  ],
});

export const Section = model<ISection>("Section", sectionSchema);
