import { model, Schema, type Types } from "mongoose";

export interface ISubSection extends Document {
  title: string;
  timeDuration: string;
  description: string;
  videoUrl: string;
  publicId: string | null;
}

const subSectionSchema = new Schema<ISubSection>({
  title: {
    type: String,
  },
  timeDuration: {
    type: String,
  },
  description: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  publicId: {
    type: String,
    default: null,
  },
});

export const SubSection = model<ISubSection>("SubSection", subSectionSchema);
