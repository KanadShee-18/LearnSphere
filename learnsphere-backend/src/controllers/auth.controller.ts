import type { Response } from "express";
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

// send otp
export const sendOtp = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body;

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      res.status(401).json({
        success: false,
        message: "User already exists.",
      });
      return;
    }

    // if no, generate OTP
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // make sure otp is unique

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
    res.status(400).json({
      success: false,
      message: "Some error occurred while generating OTP. Please try again!",
    });
  }
};

// Signup
export const signUp = async (req: AuthRequest, res: Response) => {
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
      res.status(403).json({
        success: false,
        message: "All fields are required.",
      });
      return;
    }

    // check password and confirmpassword
    if (password !== confirmPassword) {
      res.status(403).json({
        success: false,
        message: "Both passwords should be same. Please re-check both of them.",
      });
      return;
    }

    // check if user already exists or not
    const checkUser = await User.findOne({ email: email });
    if (checkUser) {
      res.status(400).json({
        success: false,
        message: "User is already registered.",
      });
      return;
    }

    // find most recent otp for user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    // validate otp
    if (recentOtp.length == 0) {
      // Otp not found
      res.status(400).json({
        success: false,
        message: "OTP not found.",
      });
      return;
    } else if (recentOtp[0] && otp !== recentOtp[0].otp) {
      res.status(400).json({
        success: false,
        message: "OTP doesn't match. Please try again!",
      });
      return;
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
    res.status(500).json({
      success: false,
      message: "Some error occurred while signing up. Please try again!",
    });
    return;
  }
};

// Login
export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fileds are mandatory.",
      });
    }
    const existingUser = await User.findOne({ email })
      .populate("additionalDetails")
      .exec();
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "User doesn't exists. Please register first.",
      });
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
      const token = jwt.sign(payload, CONFIGS.jwt_secret as string, {
        expiresIn: "24h",
      });

      const user = existingUser.toObject() as Record<string, any>;
      user.token = token;
      delete user.password;

      res
        .status(200)
        .cookie("authToken", token, {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          sameSite: true,
          httpOnly: true,
          secure: true,
        })
        .json({
          success: true,
          message: "User logged in successfully.",
          loggedUser: {
            token: token,
            dataUser: {
              data: user,
            },
          },
        });
      return;
    } else {
      // password doesn't match
      const errorMessage =
        "Password is incorrect. Please re-type the correct password.";
      return res.status(401).json({
        success: false,
        message: errorMessage,
      });
    }
  } catch (error: any) {
    console.log("Error: ", error.message);

    res.status(500).json({
      success: false,
      message: "Some error occurred while login. Please try again.",
    });
    return;
  }
};

// change password

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    // Get data from req body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    const email = req.auth?.authUser?.email;

    if (!email) {
      res.status(403).json({
        success: false,
        message: "Email is required!",
      });
      return;
    }

    // Find the existing user
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      res.status(400).json({
        success: false,
        message: "No user present with this email.",
      });
      return;
    }

    // Validate old password
    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      existingUser.password
    );
    if (!isOldPasswordCorrect) {
      res.status(401).json({
        success: false,
        message: "Old password is incorrect.",
      });
      return;
    }

    // Check if new password matches the old password
    const isSameAsOldPassword = await bcrypt.compare(
      newPassword,
      existingUser.password
    );
    if (isSameAsOldPassword) {
      res.status(401).json({
        success: false,
        message: "This password has already been used. Try another one.",
      });
      return;
    }

    // Check if new password matches confirmation password
    if (newPassword !== confirmNewPassword) {
      res.status(400).json({
        success: false,
        message: "Both passwords should match. Please re-check both fields.",
      });
      return;
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
      console.error("Failed to send email notification:", mailError.message);
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Password has been updated.",
    });
  } catch (error: any) {
    console.error("Error while updating password:", error.message);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while updating the password. Please try again.",
    });
  }
};
