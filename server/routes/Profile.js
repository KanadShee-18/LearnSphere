const express = require("express");
const router = express.Router();

// Profile handler function:
const {
  updateProfile,
  deleteProfile,
  getUserAllDetails,
  getEnrolledCourses,
  updateDisplayPicture,
} = require("../controllers/Profile");

// Profile routes:
router.delete("/deleteProfile", deleteProfile);
router.get("/getUserDetails", getUserAllDetails);
router.put("/updateProfile", updateProfile);
router.get("/getEnrolledCourses", getEnrolledCourses);
router.put("/updateDisplayPicture", updateDisplayPicture);

module.exports = router;
