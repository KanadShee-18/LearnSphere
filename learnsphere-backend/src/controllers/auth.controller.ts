import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/extend-auth.js";

import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { User } from "../models/user.model.js";
import { OTP } from "../models/otp.model.js";
import { Profile } from "../models/profile.model.js";

import { mailSender } from "../utils/mailSender.js";
import { passwordUpdateTemplate } from "../mail/templates/passwordUpdate.js";
import type { PAYLOAD_TYPE } from "../types/payload-type.js";
import { CONFIGS } from "../configs/index.js";
import logger from "../configs/logger.js";
import {
  findRefreshToken,
  revokeRefreshToken,
  signAccessToken,
  signRefreshToken,
  storeRefreshToken,
} from "../utils/generateTokens.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../utils/error-handler.js";

// send otp
export const sendOtp = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return next(new ConflictError("User already exists!"));
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
    }

    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);

    res.status(201).json({
      success: true,
      message:
        "Your otp has been generated successfull and has been sent to your gmail.",
      secureData: {
        o_t_p: {
          otp: otpBody,
        },
      },
    });
    return;
  } catch (error) {
    return next(error);
  }
};

// Signup
export const signUp = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return next(new BadRequestError("User already exists!"));
    }

    // check password and confirmpassword
    if (password !== confirmPassword) {
      return next(new ValidationError("Both passwords must match!"));
    }

    // check if user already exists or not
    const checkUser = await User.findOne({ email: email });
    if (checkUser) {
      return next(new ConflictError("User already exists!"));
    }

    // find most recent otp for user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    // validate otp
    if (recentOtp.length == 0) {
      // Otp not found
      return next(new NotFoundError("OTP not available!"));
    } else if (recentOtp[0] && otp !== recentOtp[0].otp) {
      return next(new BadRequestError("OTP doesn't match!"));
    }

    // hash password
    const hashedPass = await bcrypt.hash(password, 10);

    // db entry
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPass,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(
        firstName
      )}%20${encodeURIComponent(lastName)}`,
    });

    // return success response
    res.status(201).json({
      success: true,
      message: "User is signed up successfully.",
      userData: {
        user: {
          data: user,
        },
      },
    });
    return;
  } catch (error) {
    return next(error);
  }
};

// Login
export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new BadRequestError("All fields are required!"));
    }
    const existingUser = await User.findOne({ email })
      .populate("additionalDetails")
      .exec();
    if (!existingUser) {
      return next(new NotFoundError("User not found!"));
    }

    const payload: PAYLOAD_TYPE = {
      email: existingUser.email,
      id: existingUser._id.toString(),
      accountType: existingUser.accountType,
    };

    if (
      existingUser.password &&
      (await bcrypt.compare(password, existingUser.password))
    ) {
      // password matched
      const accessToken = signAccessToken(payload);
      const refreshToken = signRefreshToken(payload);

      logger.info("Token set to cookie in client: ", refreshToken);

      await storeRefreshToken(String(existingUser._id), refreshToken, 7);

      logger.info("Refresh token stored!");

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/api/v2/auth/refresh",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        priority: "high",
      });
      logger.info("Cookie has been set!");

      const user = existingUser.toObject() as Record<string, any>;
      // user.token = token;
      delete user.password;

      logger.info("Sending response!");

      return res.status(200).json({
        success: true,
        message: "User logged in successfully.",
        loggedUser: {
          token: accessToken,
          dataUser: {
            data: user,
          },
        },
      });
    } else {
      // password doesn't match
      const errorMessage =
        "Password is incorrect. Please re-type the correct password.";
      return next(new UnauthorizedError(errorMessage));
    }
  } catch (error: any) {
    logger.error("Error: ", error);

    return next(error);
  }
};

// Refresh access token:
export const refreshAccessToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    console.log("Cookie token: ", incomingRefreshToken);

    if (!incomingRefreshToken) {
      return next(new UnauthorizedError("Refresh token is required!"));
    }

    let payload: PAYLOAD_TYPE;
    try {
      console.log("referesh token api called!");
      const decoded = jwt.verify(incomingRefreshToken, CONFIGS.refresh_secret);
      if (typeof decoded === "string") {
        throw new Error("Invalid token decode format");
      }
      payload = decoded as PAYLOAD_TYPE;
    } catch (error) {
      return next(new UnauthorizedError("Invalid refresh token."));
    }

    const existingRefreshToken = await findRefreshToken(
      payload.id,
      incomingRefreshToken
    );
    if (!existingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not recognized.",
      });
    }

    await revokeRefreshToken(payload.id, incomingRefreshToken);

    const newAccessToken = jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        accountType: payload.accountType,
      },
      CONFIGS.jwt_secret,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        accountType: payload.accountType,
      },
      CONFIGS.refresh_secret,
      { expiresIn: "7d" }
    );

    await storeRefreshToken(payload.id, newRefreshToken, 7);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/api/v2/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      message: "Token refreshed.",
    });
  } catch (error) {
    return next(error);
  }
};

// change password

export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get data from req body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    const email = req.auth?.authUser?.email;

    if (!email) {
      return next(new UnauthorizedError("Unauthorized access."));
    }

    // Find the existing user
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return next(new NotFoundError("User not found."));
    }

    // Validate old password
    if (existingUser) {
      const isOldPasswordCorrect = await bcrypt.compare(
        oldPassword,
        existingUser.password
      );
      if (!isOldPasswordCorrect) {
        return next(new UnauthorizedError("Old password is incorrect."));
      }
    }

    // Check if new password matches the old password
    const isSameAsOldPassword = await bcrypt.compare(
      newPassword,
      existingUser.password
    );
    if (isSameAsOldPassword) {
      return next(
        new ValidationError(
          "New password cannot be the same as the old password."
        )
      );
    }

    // Check if new password matches confirmation password
    if (newPassword !== confirmNewPassword) {
      return next(
        new ValidationError(
          "Both passwords should match. Please re-check both fields."
        )
      );
    }

    // Hash the new password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await User.updateOne({ email }, { $set: { password: newHashedPassword } });

    // Send email notification
    try {
      await mailSender(
        email,
        "Password Updated - Learn Sphere",
        passwordUpdateTemplate(existingUser.firstName, existingUser.email)
      );
    } catch (mailError: any) {
      logger.error("Failed to send email notification:", mailError.message);
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Password has been updated.",
    });
  } catch (error: any) {
    logger.error("Error while updating password:", error.message);
    return next(error);
  }
};
