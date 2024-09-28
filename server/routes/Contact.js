const express = require("express");
const router = express.Router();

const { contactUsHandler } = require("../controllers/ContactUs");

router.post("/contact", contactUsHandler);

module.exports = router;
