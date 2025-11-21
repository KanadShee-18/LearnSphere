import express, { Router } from "express";
const router: Router = express.Router();

// Auth controllers
import {
  sendOtp,
  signUp,
  login,
  changePassword,
  refreshAccessToken,
} from "../controllers/auth.controller.js";

// Reset Password Controllers:
import {
  resetPasswordToken,
  resetPassword,
} from "../controllers/resetPassword.controller.js";

// Auth middleware
import { auth } from "../middlewares/auth.middleware.js";

// OTP Limiter:
import { otpLimiter } from "../middlewares/otpLimiter.middleware.js";

// Reset Password Limiter:
import { resetPasswordRequestLimiter } from "../middlewares/resetPasswordRateLimit.middleware.js";

// Authentcation routes:

// #swagger.tags = ['Auth]
router.post("/auth/login", login);
// #swagger.tags = ['Auth]
router.post("/auth/signup", signUp);
// #swagger.tags = ['Auth]
router.post("/auth/sendotp", otpLimiter, sendOtp);
// #swagger.tags = ['Auth]
router.post("/auth/changepassword", auth, changePassword);

// Reset password routes:
// #swagger.tags = ['Auth]
router.post(
  "/auth/reset-password-token",
  resetPasswordRequestLimiter,
  resetPasswordToken
);
// #swagger.tags = ['Auth]
router.post("/auth/reset-password", resetPassword);
// #swagger.tags = ['Auth]
router.post("/auth/refresh", refreshAccessToken);

export default router;
