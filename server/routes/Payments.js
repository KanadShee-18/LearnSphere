const express = require("express");
const router = express.Router();

// Payment Controllers:
const { capturePayment, veryfySignature } = require("../controllers/Payment");
const { auth, isStudent } = require("../middlewares/auth");

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifySignature", veryfySignature);

module.exports = router;
