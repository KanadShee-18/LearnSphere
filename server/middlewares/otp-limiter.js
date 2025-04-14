const rateLimit = require("express-rate-limit");

export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  message:
    "Too many requests from your side, please try again after 5 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});
