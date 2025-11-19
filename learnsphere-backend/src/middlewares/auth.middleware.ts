import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../types/extend-auth.js";
import type { PAYLOAD_TYPE } from "../types/payload-type.js";
import { User } from "../models/user.model.js";
import { CONFIGS } from "../configs/index.js";

// auth
export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header("authorization");

    const token = authHeader?.replace("Bearer ", "");

    console.log("Token comes in backend auth is: ", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing.",
      });
    }

    // Verify the token
    try {
      const decoded = jwt.verify(token, CONFIGS.jwt_secret as string);
      if (typeof decoded === "string") {
        throw new Error("Invalid token decode format");
      }
      const payload = decoded as PAYLOAD_TYPE;

      const existingUser = await User.findById(payload.id)
        .populate("additionalDetails")
        .exec();

      if (!existingUser) {
        res.status(401).json({
          success: false,
          message: "User unauthorized!",
        });
        return;
      }

      req.auth = {
        userId: payload.id,
        authUser: existingUser,
      };

      console.log("Decoded user from auth: ", payload);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
      return;
    }
    next();
  } catch (error) {
    console.log("Error in verifying token: ", error);
    if (error instanceof Error) {
      res.status(401).json({
        success: false,
        messgae: "Error in verifying token.",
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Some error occurred while verifying the token.",
      });
    }
    return;
  }
};

// isStudent
export const isStudent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.auth?.authUser?.accountType !== "Student") {
      res.status(401).json({
        success: false,
        message: "This is a protected route for students only.",
      });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User role can't be verified, please try again.",
    });
    return;
  }
};

// isInstructor
export const isInstructor = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.auth?.authUser?.accountType !== "Instructor") {
      res.status(401).json({
        success: false,
        message: "This is a protected route for instructors only.",
      });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User role can't be verified, please try again.",
    });
    return;
  }
};

// isAdmin
export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.auth?.authUser?.accountType !== "Admin") {
      res.status(401).json({
        success: false,
        message: "This is a protected route for admins only.",
      });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User role can't be verified, please try again.",
    });
    return;
  }
};
