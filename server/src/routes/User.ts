import express, { Router } from "express";
const router: Router = express.Router();

// Auth controllers
import { sendOtp, signUp, login, changePassword } from "../controllers/Auth.js";

// Reset Password Controllers:
import {
  resetPasswordToken,
  resetPassword,
} from "../controllers/ResetPassword.js";

// Auth middleware
import { auth } from "../middlewares/auth.js";

// OTP Limiter:
import { otpLimiter } from "../middlewares/otp-limiter.js";

// Reset Password Limiter:
import { resetPasswordRequestLimiter } from "../middlewares/reset-password-rate-limit.js";

// Authentcation routes:

router.post("/auth/login", login);
router.post("/auth/signup", signUp);
router.post("/auth/sendotp", otpLimiter, sendOtp);
router.post("/auth/changepassword", auth, changePassword);

// Reset password routes:
router.post(
  "/auth/reset-password-token",
  resetPasswordRequestLimiter,
  resetPasswordToken
);
router.post("/auth/reset-password", resetPassword);

export default router;
