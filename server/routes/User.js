const express = require("express");
const router = express.Router();

// Auth controllers
const {
  sendOtp,
  signUp,
  login,
  changePassword,
} = require("../controllers/Auth");

// Reset Password Controllers:
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");

// Auth middleware
const { auth } = require("../middlewares/auth");

// OTP Limiter:
const { otpLimiter } = require("../middlewares/otp-limiter");

// Reset Password Limiter:
const {
  resetPasswordRequestLimiter,
} = require("../middlewares/reset-password-rate-limit");

// Authentcation routes:

router.post("/login", login);
router.post("/signup", signUp);
router.post("/sendotp", otpLimiter, sendOtp);
router.post("/changepassword", auth, changePassword);

// Reset password routes:
router.post(
  "/reset-password-token",
  resetPasswordRequestLimiter,
  resetPasswordToken
);
router.post("/reset-password", resetPassword);

module.exports = router;
