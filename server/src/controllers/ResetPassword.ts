import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { AuthRequest } from "../types/extend-auth.js";
import type { Response } from "express";
import { User } from "../models/User.js";
import { mailSender } from "../utils/mailSender.js";
import { passwordReset } from "../mail/templates/passwordReset.js";
import { passwordUpdateTemplate } from "../mail/templates/passwordUpdate.js";
import { CONFIGS } from "../config/index.js";

const baseURL = CONFIGS.client_side_url;

export const resetPasswordToken = async (req: AuthRequest, res: Response) => {
  try {
    // get email from body
    const { email } = req.body;

    // check user for this email exists or not
    const user = await User.findOne({ email: email });
    // email validation
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Your email doesn't registered with us. Please re-check it.",
      });
      return;
    }
    // generate token
    const token = crypto.randomBytes(20).toString("hex");
    // update user by adding token and expire time
    await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );
    // create url
    const url = `${baseURL}/update-password/${token}`;
    // send mail containing the url
    await mailSender(
      email,
      "Password Reset Link",
      passwordReset(user.firstName, url)
    );
    // return response
    res.status(200).json({
      success: true,
      message: `Email sent successfully. Please check your email ${email} to continue further.`,
    });
  } catch (error) {
    console.log("Error in reset password token: ", error);
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "An unknown error occurred.",
      });
    }
    return;
  }
};

// Reset Password:

export const resetPassword = async (req: AuthRequest, res: Response) => {
  try {
    // fetch data
    const { password, confirmPassword, token } = req.body;
    // validation
    if (password !== confirmPassword) {
      res.json({
        successs: false,
        message: "Both passwords should be same. Please re-check them.",
      });
      return;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    // validation for password strength
    if (!passwordRegex.test(password)) {
      res.json({
        success: false,
        message:
          "Password must be at least 8 characters long and include at least one digit, one lowercase letter, and one uppercase letter.",
      });
      return;
    }

    // get user details using token
    const userDetails = await User.findOne({
      token: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    // if no entry - token invalid or token time expires
    if (!userDetails) {
      res.status(401).json({
        success: false,
        messgae: "Token has been expired or invalid token.",
      });
      return;
    }
    // hash new password
    const newHashedPassword = await bcrypt.hash(password, 10);
    // update password
    const updateUserRes = await User.findOneAndUpdate(
      { token: token },
      { password: newHashedPassword },
      { new: true }
    );

    await mailSender(
      userDetails.email,
      "Update from LearnSphere",
      passwordUpdateTemplate(userDetails.email, userDetails.firstName)
    );

    // return response
    res.status(201).json({
      success: true,
      message: "Your password has been reset successfully.",
      userUpdatedData: {
        data: {
          userData: {
            data: updateUserRes,
          },
        },
      },
    });
    return;
  } catch (error) {
    console.log("Error in resetting password: ", error);
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "An unknown error occurred.",
      });
    }
    return;
  }
};
