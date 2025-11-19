import express, { Router } from "express";
const router: Router = express.Router();

// Payment Controllers:
// const { capturePayment, verifyPayment} = require("../controllers/Payment");
import {
  capturePayment,
  verifyPayment,
  sendPaymentSuccessEmail,
} from "../controllers/payment.controller.js";
import { auth, isStudent } from "../middlewares/auth.middleware.js";

router.post("/payment/capturePayment", auth, isStudent, capturePayment);
router.post("/payment/verifyPayment", auth, isStudent, verifyPayment);
router.post(
  "/payment/sendPaymentSuccessEmail",
  auth,
  isStudent,
  sendPaymentSuccessEmail
);

export default router;
