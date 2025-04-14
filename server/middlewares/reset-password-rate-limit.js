const rateLimit = require("express-rate-limit");

const resetPasswordRequestLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message:
    "Too many requests from your side, please try again after 5 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { resetPasswordRequestLimiter };
