import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { AuthRequest } from "../types/extend-auth.js";
import type { NextFunction, Response } from "express";
import { User } from "../models/user.model.js";
import { mailSender } from "../utils/mailSender.js";
import { passwordReset } from "../mail/templates/passwordReset.js";
import { passwordUpdateTemplate } from "../mail/templates/passwordUpdate.js";
import { CONFIGS } from "../configs/index.js";
import logger from "../configs/logger.js";
import { BadRequestError, NotFoundError } from "../utils/error-handler.js";

const baseURL = CONFIGS.client_side_url;

export const resetPasswordToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // get email from body
    const { email } = req.body;

    if (!email) {
      return next(new BadRequestError("Email is required."));
    }

    // check user for this email exists or not
    const user = await User.findOne({ email: email });
    // email validation
    if (!user) {
      return next(new NotFoundError("User not found."));
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
    logger.error("Error in reset password token: ", error);
    return next(error);
  }
};

// Reset Password:

export const resetPassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // fetch data
    const { password, confirmPassword, token } = req.body;
    // validation
    if (password !== confirmPassword) {
      return next(new BadRequestError("Passwords do not match."));
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    // validation for password strength
    if (!passwordRegex.test(password)) {
      return next(
        new BadRequestError(
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number."
        )
      );
    }

    // get user details using token
    const userDetails = await User.findOne({
      token: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    // if no entry - token invalid or token time expires
    if (!userDetails) {
      return next(
        new BadRequestError("Password reset token is invalid or has expired.")
      );
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
    logger.error("Error in resetting password: ", error);
    return next(error);
  }
};
