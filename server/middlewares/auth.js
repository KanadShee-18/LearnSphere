const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// auth
exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing.",
      });
    }

    // Verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
    next();
  } catch (error) {
    res.status(402).json({
      error: error.message,
      success: false,
      message: "Some error occurred while verifying the token.",
    });
  }
};

// isStudent
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for students only.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User role can't be verified, please try again.",
    });
  }
};

// isInstructor
exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for instructors only.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User role can't be verified, please try again.",
    });
  }
};

// isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for admins only.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User role can't be verified, please try again.",
    });
  }
};
