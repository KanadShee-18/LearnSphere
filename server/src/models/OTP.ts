import { Document, model, Schema, type Date } from "mongoose";
import { mailSender } from "../utils/mailSender.js";
import { otpTemplate } from "../mail/templates/emailVerificationTemplate.js";

export interface IOtp extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60,
  },
});

async function sendVerificationEmail(email: string, otp: string) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      otpTemplate(otp)
    );
    console.log("Email sent successfully: ", mailResponse.response);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

otpSchema.pre<IOtp>("save", async function (next) {
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

export const OTP = model<IOtp>("OTP", otpSchema);
